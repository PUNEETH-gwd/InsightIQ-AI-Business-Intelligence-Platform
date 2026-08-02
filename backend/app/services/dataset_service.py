from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.repositories.dataset_repository import DatasetRepository
import pandas as pd

class DatasetService:

    def __init__(self, db: Session):
        self.repository = DatasetRepository(db)

    def create_dataset(
        self,
        name: str,
        file_path: str,
        file_type: str,
        owner_id,
    ):
        dataset = Dataset(
            name=name,
            file_path=file_path,
            file_type=file_type,
            owner_id=owner_id,
        )

        return self.repository.create(dataset)

    def get_user_datasets(self, owner_id):
        return self.repository.get_all_by_user(owner_id)

    def delete_dataset(self, dataset):
        self.repository.delete(dataset)


    def preview_dataset(self, dataset):
      path = dataset.file_path

      if dataset.file_type == "csv":
        df = pd.read_csv(path)

      elif dataset.file_type == "xlsx":
        df = pd.read_excel(path)

      elif dataset.file_type == "json":
        df = pd.read_json(path)

      else:
        raise ValueError("Unsupported file type")

      return {
        "columns": df.columns.tolist(),
        "rows": df.head(10).to_dict(orient="records"),
        "total_rows": len(df),
        "total_columns": len(df.columns),
      }
    def get_dataset(self, dataset_id):
      return self.repository.get_by_id(dataset_id)