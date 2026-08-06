from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import json
import pandas as pd

from app.api.deps import get_current_user
from app.core.database import get_db
from app.services.dataset_service import DatasetService
from app.services.pdf_service import PDFService

router = APIRouter(
    prefix="/api/v1/pdf",
    tags=["PDF"],
)

pdf_service = PDFService()


@router.get("/report/{dataset_id}")
def generate_pdf_report(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DatasetService(db)

    dataset = service.get_dataset(dataset_id)

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

    df = pd.read_csv(dataset.file_path)

    automl = {}

    automl_path = os.path.join(
        "reports",
        "automl_result.json",
    )

    if os.path.exists(automl_path):
        with open(
            automl_path,
            "r",
        ) as file:
            automl = json.load(file)

    report_data = {
        "dataset_summary": {
            "dataset_name": dataset.name,
            "rows": len(df),
            "columns": len(df.columns),
            "target_column": automl.get(
                "target_column",
                "Not Available",
            ),
            "problem_type": automl.get(
                "problem_type",
                "Not Trained",
            ),
        },
        "data_quality": {
            "missing_values": int(df.isnull().sum().sum()),
            "duplicates": int(df.duplicated().sum()),
            "outliers": [],
        },
        "best_model": automl.get(
            "best_model",
            "Not Trained",
        ),
        "models": automl.get(
            "all_models",
            [],
        ),
        "explanation": [
            f"InsightIQ detected this as a {automl.get('problem_type', 'Machine Learning')} problem.",
            f"The best model selected was {automl.get('best_model', 'Unknown')}.",
        ],
        "suggestions": [
            "Review missing values before deployment.",
            "Retrain the model periodically with new data.",
        ],
    }

    os.makedirs(
        "reports",
        exist_ok=True,
    )

    output_path = os.path.join(
        "reports",
        "InsightIQ_Report.pdf",
    )

    pdf_service.generate_report(
        output_path,
        report_data,
    )

    return FileResponse(
        output_path,
        filename="InsightIQ_Report.pdf",
        media_type="application/pdf",
    )