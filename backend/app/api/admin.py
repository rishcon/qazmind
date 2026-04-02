from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io

from app.core.deps import check_admin
from app.db.bootstrap import ensure_default_subjects
from app.db.database import get_db
from app.db.models import Question, Subject, Flashcard
from app.schemas.schemas import QuestionCreate

router = APIRouter(dependencies=[Depends(check_admin)])


@router.get("/subjects")
async def get_subjects(db: Session = Depends(get_db)):
    """Get all subjects for admin"""
    subjects = db.query(Subject).all()
    if not subjects:
        ensure_default_subjects(db)
        subjects = db.query(Subject).all()

    question_counts = dict(
        db.query(Question.subject_id, func.count(Question.id))
        .group_by(Question.subject_id)
        .all()
    )

    return [
        {
            "id": s.id,
            "name_kz": s.name_kz,
            "name_ru": s.name_ru,
            "icon": s.icon,
            "questions_count": question_counts.get(s.id, 0)
        }
        for s in subjects
    ]


@router.get("/subjects/{subject_id}")
async def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """Get a single subject by ID"""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    questions_count = (
        db.query(func.count(Question.id))
        .filter(Question.subject_id == subject_id)
        .scalar()
    ) or 0

    return {
        "id": subject.id,
        "name_kz": subject.name_kz,
        "name_ru": subject.name_ru,
        "icon": subject.icon,
        "questions_count": questions_count
    }


@router.get("/questions/stats")
async def get_questions_stats(db: Session = Depends(get_db)):
    """Get statistics about questions"""
    total = db.query(func.count(Question.id)).scalar() or 0
    by_subject = {}
    
    subjects = db.query(Subject).all()
    for subject in subjects:
        count = (
            db.query(func.count(Question.id))
            .filter(Question.subject_id == subject.id)
            .scalar()
        ) or 0
        by_subject[subject.name_ru] = count
    
    return {
        "total": total,
        "by_subject": by_subject
    }


@router.post("/questions/bulk")
async def create_questions_bulk(
    questions: List[QuestionCreate],
    db: Session = Depends(get_db)
):
    """Bulk create questions from JSON array"""
    
    print(f"DEBUG: Получено {len(questions)} вопросов")
    created_count = 0
    created_payloads = []
    errors = []
    
    for idx, q_data in enumerate(questions):
        try:
            print(f"DEBUG: Обработка вопроса {idx+1}, subject_id={q_data.subject_id}")
            # Validate subject exists
            subject = db.query(Subject).filter(Subject.id == q_data.subject_id).first()
            if not subject:
                errors.append(f"Question {idx+1}: Subject ID {q_data.subject_id} not found")
                print(f"DEBUG: Subject {q_data.subject_id} не найден!")
                continue
            
            # Validate options
            if len(q_data.options_kz) != 4 or len(q_data.options_ru) != 4:
                errors.append(f"Question {idx+1}: Must have exactly 4 options")
                print(f"DEBUG: Вопрос {idx+1} - неверное количество опций!")
                continue
            
            if not (0 <= q_data.correct_answer_index <= 3):
                errors.append(f"Question {idx+1}: correct_answer_index must be 0-3")
                print(f"DEBUG: Вопрос {idx+1} - неверный индекс ответа!")
                continue
            
            print(f"DEBUG: Создаю Question объект для вопроса {idx+1}")
            question = Question(
                subject_id=q_data.subject_id,
                text_kz=q_data.text_kz,
                text_ru=q_data.text_ru,
                options_kz=q_data.options_kz,
                options_ru=q_data.options_ru,
                correct_answer_index=q_data.correct_answer_index,
                fact_snippet_kz=q_data.fact_snippet_kz or "",
                fact_snippet_ru=q_data.fact_snippet_ru or "",
                difficulty=q_data.difficulty or "medium",
                topic=q_data.topic
            )
            
            print(f"DEBUG: Добавляю вопрос {idx+1} в сессию")
            db.add(question)
            created_payloads.append(
                {
                    "subject_id": q_data.subject_id,
                    "text_ru": q_data.text_ru,
                    "text_kz": q_data.text_kz,
                    "options_ru": q_data.options_ru,
                    "options_kz": q_data.options_kz,
                    "correct_answer_index": q_data.correct_answer_index,
                    "fact_snippet_ru": q_data.fact_snippet_ru or "",
                    "fact_snippet_kz": q_data.fact_snippet_kz or "",
                }
            )
            created_count += 1
            print(f"DEBUG: created_count = {created_count}")
            
        except Exception as e:
            print(f"DEBUG: ОШИБКА в вопросе {idx+1}: {str(e)}")
            errors.append(f"Question {idx+1}: {str(e)}")
    
    try:
        db.commit()

        flashcards_created = 0
        for payload in created_payloads:
            existing = db.query(Flashcard).filter(
                Flashcard.subject_id == payload["subject_id"],
                Flashcard.front == payload["text_ru"]
            ).first()

            if existing:
                continue

            correct_answer_ru = payload["options_ru"][payload["correct_answer_index"]]
            correct_answer_kz = payload["options_kz"][payload["correct_answer_index"]]
            flashcard = Flashcard(
                subject_id=payload["subject_id"],
                front=payload["text_ru"],
                front_kz=payload["text_kz"],
                back=f"✅ {correct_answer_ru}",
                back_kz=f"✅ {correct_answer_kz}",
                hint_kz=payload["fact_snippet_kz"] or None,
                hint=payload["fact_snippet_ru"] or None
            )
            db.add(flashcard)
            flashcards_created += 1

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "success": True,
        "created": created_count,
        "total_submitted": len(questions),
        "errors": errors if errors else None,
        "flashcards_created": flashcards_created
    }


@router.post("/questions/import-csv")
async def import_questions_csv(
    file: UploadFile = File(...),
    subject_id: int = Form(...),
    db: Session = Depends(get_db)
):
    """Import questions from CSV file"""
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files supported")
    
    # Validate subject exists
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    content = await file.read()
    csv_file = io.StringIO(content.decode('utf-8'))
    reader = csv.DictReader(csv_file)
    
    imported_count = 0
    errors = []
    
    for idx, row in enumerate(reader, start=1):
        try:
            # Parse options (separated by |)
            options_kz = [opt.strip() for opt in row['options_kz'].split('|')]
            options_ru = [opt.strip() for opt in row['options_ru'].split('|')]
            
            if len(options_kz) != 4 or len(options_ru) != 4:
                errors.append(f"Row {idx}: Must have 4 options")
                continue
            
            question = Question(
                subject_id=subject_id,  # Use subject_id from form
                text_kz=row['text_kz'],
                text_ru=row['text_ru'],
                options_kz=options_kz,
                options_ru=options_ru,
                correct_answer_index=int(row['correct_answer_index']),
                fact_snippet_kz=row.get('fact_snippet_kz', ''),
                fact_snippet_ru=row.get('fact_snippet_ru', ''),
                difficulty=row.get('difficulty', 'medium'),
                topic=row.get('topic', '')
            )
            
            db.add(question)
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")
    
    try:
        db.commit()
        
        # Автоматически создаем флеш-карточки из импортированных вопросов
        flashcards_created = 0
        questions = db.query(Question).filter(Question.subject_id == subject_id).all()
        
        for question in questions:
            # Проверяем, есть ли уже карточка для этого вопроса
            existing = db.query(Flashcard).filter(
                Flashcard.subject_id == question.subject_id,
                Flashcard.front == question.text_ru
            ).first()
            
            if existing:
                continue
            
            # Создаем карточку: вопрос на лицевой стороне, правильный ответ на обратной
            correct_answer_ru = question.options_ru[question.correct_answer_index]
            correct_answer_kz = question.options_kz[question.correct_answer_index]
            
            flashcard = Flashcard(
                subject_id=question.subject_id,
                front=question.text_ru,
                front_kz=question.text_kz,
                back=f"✅ {correct_answer_ru}",
                back_kz=f"✅ {correct_answer_kz}",
                hint_kz=question.fact_snippet_kz if question.fact_snippet_kz else None,
                hint=question.fact_snippet_ru if question.fact_snippet_ru else None
            )
            db.add(flashcard)
            flashcards_created += 1
        
        db.commit()
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "success": True,
        "imported": imported_count,
        "flashcards_created": flashcards_created,
        "errors": errors if errors else None
    }


@router.delete("/questions/{question_id}")
async def delete_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    """Delete a question"""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    db.delete(question)
    db.commit()
    
    return {"success": True, "message": "Question deleted"}
