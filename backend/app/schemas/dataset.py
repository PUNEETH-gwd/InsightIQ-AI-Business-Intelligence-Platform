from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DatasetResponse(BaseModel):
    id: UUID
    name: str
    file_path: str
    file_type: str
    owner_id: UUID
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChartRequest(BaseModel):
    chart_type: str
    x_column: str
    y_column: str | None = None