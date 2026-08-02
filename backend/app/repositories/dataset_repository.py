from uuid import UUID

from sqlalchemy.orm import Session

from app.models.dataset import Dataset


class DatasetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, dataset: Dataset):
        self.db.add(dataset)
        self.db.commit()
        self.db.refresh(dataset)
        return dataset

    def get_all_by_user(self, owner_id: UUID):
        return (
            self.db.query(Dataset)
            .filter(Dataset.owner_id == owner_id)
            .all()
        )

    def get_by_id(self, dataset_id: UUID):
        return (
            self.db.query(Dataset)
            .filter(Dataset.id == dataset_id)
            .first()
        )

    def delete(self, dataset: Dataset):
        self.db.delete(dataset)
        self.db.commit()