from datetime import datetime
import os
import shutil
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.deps import check_admin
from app.db.database import get_db
from app.db.models import Podcast
from app.schemas.schemas import PodcastResponse

router = APIRouter(prefix="/api/podcasts", tags=["podcasts"])

STATIC_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "static",
    "podcasts"
)


@router.get("/", response_model=List[PodcastResponse])
def get_podcasts(
    subject_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(Podcast).filter(Podcast.is_active == True)
    if subject_id:
        query = query.filter(Podcast.subject_id == subject_id)
    return query.order_by(Podcast.order_index, Podcast.created_at).all()


@router.get("/{podcast_id}", response_model=PodcastResponse)
def get_podcast(podcast_id: int, db: Session = Depends(get_db)):
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return podcast


@router.get("/{podcast_id}/audio")
def get_podcast_audio(podcast_id: int, db: Session = Depends(get_db)):
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")

    audio_path = os.path.join(STATIC_DIR, podcast.audio_filename)
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")

    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=podcast.audio_filename
    )


@router.post("/", response_model=PodcastResponse)
async def create_podcast(
    subject_id: int = Form(...),
    title_kz: str = Form(...),
    title_ru: str = Form(...),
    description_kz: str = Form(...),
    description_ru: str = Form(...),
    topic: str = Form(...),
    difficulty: str = Form(...),
    order_index: int = Form(0),
    audio_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(check_admin)
):
    if not audio_file.content_type or not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(audio_file.filename or "")[1]
    filename = f"podcast_{timestamp}{file_extension}"

    os.makedirs(STATIC_DIR, exist_ok=True)
    file_path = os.path.join(STATIC_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)

    new_podcast = Podcast(
        subject_id=subject_id,
        title_kz=title_kz,
        title_ru=title_ru,
        description_kz=description_kz,
        description_ru=description_ru,
        topic=topic,
        audio_filename=filename,
        duration_seconds=0,
        difficulty=difficulty,
        order_index=order_index,
        is_active=True
    )
    db.add(new_podcast)
    db.commit()
    db.refresh(new_podcast)
    return new_podcast


@router.delete("/{podcast_id}")
def delete_podcast(
    podcast_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(check_admin)
):
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")

    audio_path = os.path.join(STATIC_DIR, podcast.audio_filename)
    if os.path.exists(audio_path):
        os.remove(audio_path)

    db.delete(podcast)
    db.commit()
    return {"message": "Podcast deleted successfully"}
