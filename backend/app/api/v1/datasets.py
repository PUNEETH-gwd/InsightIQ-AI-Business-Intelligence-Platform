import os
import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.dataset import DatasetResponse
from app.services.dataset_service import DatasetService

router = APIRouter(
    prefix="/api/v1/datasets",
    tags=["Datasets"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post(
    "/upload",
    response_model=DatasetResponse
)
def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    allowed_extensions = {
        ".csv",
        ".xlsx",
        ".json",
    }

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    service = DatasetService(db)

    dataset = service.create_dataset(
        name=file.filename,
        file_path=str(file_path),
        file_type=extension.replace(".", ""),
        owner_id=current_user.id,
    )

    return dataset

@router.get("/{dataset_id}/preview")
def preview_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):



    
    service = DatasetService(db)

    dataset = service.repository.get_by_id(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return service.preview_dataset(dataset)


@router.get(
    "",
    response_model=list[DatasetResponse]
)
def list_datasets(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DatasetService(db)

    return service.get_user_datasets(
        current_user.id
    )


@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DatasetService(db)

    dataset = service.get_dataset(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # Delete the file from disk if it exists
    if os.path.exists(dataset.file_path):
        os.remove(dataset.file_path)

    service.delete_dataset(dataset)

    return {
        "message": "Dataset deleted successfully"
    }