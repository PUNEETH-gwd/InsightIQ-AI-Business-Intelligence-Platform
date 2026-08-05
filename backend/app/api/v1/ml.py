from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.ml import TrainRequest
from app.services.dataset_service import DatasetService
from app.services.ml_service import MLService
from fastapi import UploadFile, File
import shutil
import os

router = APIRouter(
    prefix="/api/v1/ml",
    tags=["Machine Learning"],
)


@router.post("/train")
def train_model(
    request: TrainRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    dataset_service = DatasetService(db)

    dataset = dataset_service.get_dataset(
        request.dataset_id
    )

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    ml = MLService()

    return ml.train_model(
    dataset.file_path,
    request.target_column,
)

@router.get("/{dataset_id}/ai-report")
def get_ai_report(
    dataset_id: str,
    target_column: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    dataset = DatasetRepository(db).get_by_id(dataset_id)

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    dataset_service = DatasetService(db)
    ml_service = MLService()

    quality_report = dataset_service.quality_summary(dataset)

    automl_result = ml_service.train_model(
        dataset.file_path,
        target_column,
    )

    report = ml_service.generate_ai_report(
        dataset.name,
        target_column,
        automl_result["problem_type"],
        quality_report,
        automl_result,
    )

    return report

@router.post("/predict")
def predict(
    file: UploadFile = File(...)
):
    upload_dir = "prediction_uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True,
    )

    dataset_path = os.path.join(
        upload_dir,
        file.filename,
    )

    with open(dataset_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    ml = MLService()

    result = ml.predict(
        "trained_models/best_model.pkl",
        dataset_path,
    )

    return result

    raise HTTPException(
        status_code=400,
        detail="Unsupported algorithm",
    )