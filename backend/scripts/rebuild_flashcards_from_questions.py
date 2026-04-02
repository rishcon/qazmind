import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import SessionLocal
from app.db.models import Question, Flashcard


def rebuild_flashcards():
    db: Session = SessionLocal()
    created = 0
    skipped = 0
    updated = 0

    try:
        db.execute(text("ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS front_kz TEXT"))
        db.execute(text("ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS back_kz TEXT"))
        db.execute(text("ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS hint_kz TEXT"))
        db.commit()

        questions = db.query(Question).all()
        for question in questions:
            existing = db.query(Flashcard).filter(
                Flashcard.subject_id == question.subject_id,
                Flashcard.front == question.text_ru
            ).first()

            if existing:
                has_updates = False
                if not existing.front_kz and question.text_kz:
                    existing.front_kz = question.text_kz
                    has_updates = True
                if not existing.back_kz:
                    correct_answer_kz = question.options_kz[question.correct_answer_index]
                    existing.back_kz = f"✅ {correct_answer_kz}"
                    has_updates = True
                if not existing.hint_kz and question.fact_snippet_kz:
                    existing.hint_kz = question.fact_snippet_kz
                    has_updates = True

                if has_updates:
                    updated += 1
                else:
                    skipped += 1
                continue

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
            created += 1

        db.commit()
        print(f"Created flashcards: {created}")
        print(f"Updated flashcards: {updated}")
        print(f"Skipped (already existed): {skipped}")
    except Exception as exc:
        db.rollback()
        print(f"Error rebuilding flashcards: {exc}")
    finally:
        db.close()


if __name__ == "__main__":
    rebuild_flashcards()
