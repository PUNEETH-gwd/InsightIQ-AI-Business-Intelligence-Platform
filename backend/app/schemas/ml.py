from pydantic import BaseModel


class TrainRequest(BaseModel):
    dataset_id: str
    target_column: str
    algorithm: str