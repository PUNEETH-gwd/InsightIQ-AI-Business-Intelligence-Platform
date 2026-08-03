from sqlalchemy.orm import Session
import pandas as pd

from app.models.dataset import Dataset
from app.repositories.dataset_repository import DatasetRepository


class DatasetService:

    def __init__(self, db: Session):
        self.repository = DatasetRepository(db)

    # -----------------------------
    # Helper Function
    # -----------------------------
    def load_dataframe(self, dataset):
        path = dataset.file_path

        if dataset.file_type == "csv":
            return pd.read_csv(path)

        elif dataset.file_type == "xlsx":
            return pd.read_excel(path)

        elif dataset.file_type == "json":
            return pd.read_json(path)

        else:
            raise ValueError("Unsupported file type")

    # -----------------------------
    # Dataset CRUD
    # -----------------------------
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

    def get_dataset(self, dataset_id):
        return self.repository.get_by_id(dataset_id)

    def delete_dataset(self, dataset):
        self.repository.delete(dataset)

    # -----------------------------
    # Preview
    # -----------------------------
    def preview_dataset(self, dataset):
     df = self.load_dataframe(dataset)

    # Convert NaN values to None so FastAPI can return valid JSON
     df = df.astype(object).where(pd.notnull(df), None)

     return {
        "columns": df.columns.tolist(),
        "rows": df.head(10).to_dict(orient="records"),
        "total_rows": len(df),
        "total_columns": len(df.columns),
    }
    # -----------------------------
    # Statistics
    # -----------------------------
    def dataset_statistics(self, dataset):
        df = self.load_dataframe(dataset)

        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
        }

    # -----------------------------
    # Missing Values
    # -----------------------------
    def missing_values(self, dataset):
        df = self.load_dataframe(dataset)

        missing = df.isnull().sum()

        return {
            "total_missing": int(missing.sum()),
            "missing_by_column": {
                column: int(count)
                for column, count in missing.items()
            }
        }

    # -----------------------------
    # Duplicate Rows
    # -----------------------------
    def duplicate_rows(self, dataset):
        df = self.load_dataframe(dataset)

        duplicates = int(df.duplicated().sum())

        return {
            "duplicate_rows": duplicates
        }

    # -----------------------------
    # Data Types
    # -----------------------------
    def column_data_types(self, dataset):
        df = self.load_dataframe(dataset)

        return {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        }

    # -----------------------------
    # Outlier Detection
    # -----------------------------
    def outlier_detection(self, dataset):
        df = self.load_dataframe(dataset)

        numeric_columns = df.select_dtypes(include=["number"]).columns

        outliers = {}

        for column in numeric_columns:
            q1 = df[column].quantile(0.25)
            q3 = df[column].quantile(0.75)

            iqr = q3 - q1

            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr

            count = df[
                (df[column] < lower) |
                (df[column] > upper)
            ].shape[0]

            outliers[column] = int(count)

        return outliers

    # -----------------------------
    # Quality Summary
    # -----------------------------
    def quality_summary(self, dataset):
        return {
            "statistics": self.dataset_statistics(dataset),
            "missing_values": self.missing_values(dataset),
            "duplicates": self.duplicate_rows(dataset),
            "data_types": self.column_data_types(dataset),
            "outliers": self.outlier_detection(dataset),
        }

    # -----------------------------
    # Cleaning APIs
    # -----------------------------
    def remove_duplicates(self, dataset):
        df = self.load_dataframe(dataset)

        before = len(df)

        df = df.drop_duplicates()

        after = len(df)

        path = dataset.file_path

        if dataset.file_type == "csv":
            df.to_csv(path, index=False)

        elif dataset.file_type == "xlsx":
            df.to_excel(path, index=False)

        elif dataset.file_type == "json":
            df.to_json(path, orient="records", indent=4)

        return {
            "removed_duplicates": before - after,
            "remaining_rows": after,
        }

    def fill_missing_values(self, dataset):
        df = self.load_dataframe(dataset)

        for column in df.columns:
            if df[column].dtype in ["int64", "float64"]:
                df[column] = df[column].fillna(df[column].mean())
            else:
                df[column] = df[column].fillna("Unknown")

        path = dataset.file_path

        if dataset.file_type == "csv":
            df.to_csv(path, index=False)

        elif dataset.file_type == "xlsx":
            df.to_excel(path, index=False)

        elif dataset.file_type == "json":
            df.to_json(path, orient="records", indent=4)

        return {
            "message": "Missing values filled successfully"
        }

    def drop_missing_rows(self, dataset):
        df = self.load_dataframe(dataset)

        before = len(df)

        df = df.dropna()

        after = len(df)

        path = dataset.file_path

        if dataset.file_type == "csv":
            df.to_csv(path, index=False)

        elif dataset.file_type == "xlsx":
            df.to_excel(path, index=False)

        elif dataset.file_type == "json":
            df.to_json(path, orient="records", indent=4)

        return {
            "removed_rows": before - after,
            "remaining_rows": after,
        }