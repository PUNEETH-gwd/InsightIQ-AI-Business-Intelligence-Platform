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

        # Convert NaN to None for JSON
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
            },
        }

    # -----------------------------
    # Duplicate Rows
    # -----------------------------
    def duplicate_rows(self, dataset):
        df = self.load_dataframe(dataset)

        return {
            "duplicate_rows": int(df.duplicated().sum())
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
                (df[column] < lower)
                | (df[column] > upper)
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
    # Bar Chart Data
    # -----------------------------
    def bar_chart_data(self, dataset):
        df = self.load_dataframe(dataset)

        numeric_columns = df.select_dtypes(include=["number"]).columns

        if len(numeric_columns) == 0:
            return []

        chart = []

        for column in numeric_columns:
            chart.append({
                "name": column,
                "value": float(df[column].mean())
            })

        return chart

        # -----------------------------
    # Dynamic Chart
    # -----------------------------
    def generate_chart(self, dataset, chart_request):
        df = self.load_dataframe(dataset)

        x = chart_request.x_axis
        y = chart_request.y_axis

        if x not in df.columns:
            raise ValueError("Invalid X Axis")

        if y not in df.columns:
            raise ValueError("Invalid Y Axis")

        # Ensure Y-axis is numeric
        if not pd.api.types.is_numeric_dtype(df[y]):
            raise ValueError(
                f"'{y}' must be a numeric column."
            )

        chart = []

        for _, row in df.iterrows():
            chart.append({
                "name": str(row[x]),
                "value": float(row[y])
            })

        return chart

    # -----------------------------
    # Cleaning APIs
    # -----------------------------
    def remove_duplicates(self, dataset):
        df = self.load_dataframe(dataset)

        before = len(df)

        df = df.drop_duplicates()

        after = len(df)

        if dataset.file_type == "csv":
            df.to_csv(dataset.file_path, index=False)

        elif dataset.file_type == "xlsx":
            df.to_excel(dataset.file_path, index=False)

        elif dataset.file_type == "json":
            df.to_json(
                dataset.file_path,
                orient="records",
                indent=4,
            )

        return {
            "removed_duplicates": before - after,
            "remaining_rows": after,
        }

    def fill_missing_values(self, dataset):
        df = self.load_dataframe(dataset)

        for column in df.columns:

            if pd.api.types.is_numeric_dtype(df[column]):
                df[column] = df[column].fillna(
                    df[column].mean()
                )
            else:
                df[column] = df[column].fillna("Unknown")

        if dataset.file_type == "csv":
            df.to_csv(dataset.file_path, index=False)

        elif dataset.file_type == "xlsx":
            df.to_excel(dataset.file_path, index=False)

        elif dataset.file_type == "json":
            df.to_json(
                dataset.file_path,
                orient="records",
                indent=4,
            )

        return {
            "message": "Missing values filled successfully"
        }

    def drop_missing_rows(self, dataset):
        df = self.load_dataframe(dataset)

        before = len(df)

        df = df.dropna()

        after = len(df)

        if dataset.file_type == "csv":
            df.to_csv(dataset.file_path, index=False)

        elif dataset.file_type == "xlsx":
            df.to_excel(dataset.file_path, index=False)

        elif dataset.file_type == "json":
            df.to_json(
                dataset.file_path,
                orient="records",
                indent=4,
            )

        return {
            "removed_rows": before - after,
            "remaining_rows": after,
        }
    def ai_insights(self, dataset):
        df = self.load_dataframe(dataset)

        stats = self.dataset_statistics(dataset)
        missing = self.missing_values(dataset)
        duplicates = self.duplicate_rows(dataset)
        outliers = self.outlier_detection(dataset)

        numeric_columns = df.select_dtypes(include=["number"]).columns.tolist()
        categorical_columns = df.select_dtypes(exclude=["number"]).columns.tolist()

    # -----------------------------
    # Data Health Score
    # -----------------------------
        score = 100

        score -= min(missing["total_missing"], 20)
        score -= min(duplicates["duplicate_rows"] * 2, 20)
        score -= min(sum(outliers.values()), 20)

        if score < 0:
            score = 0

    # -----------------------------
    # AI Recommendations
    # -----------------------------
        recommendations = []

        if missing["total_missing"] > 0:
            recommendations.append(
                "Fill missing values before training machine learning models."
        )

        if duplicates["duplicate_rows"] > 0:
            recommendations.append(
            "Remove duplicate rows to improve data quality."
        )

        if sum(outliers.values()) > 0:
            recommendations.append(
            "Treat outliers using IQR or Z-score before regression."
        )

        if len(categorical_columns) > 0:
          recommendations.append(
            "Encode categorical columns before model training."
        )

        if len(numeric_columns) > 0:
         recommendations.append(
            "Scale numeric features if using distance-based algorithms."
        )

    # -----------------------------
    # Suggested Algorithms
    # -----------------------------
         algorithms = []

        if len(numeric_columns) >= 2:
          algorithms.extend([
            "Random Forest ⭐⭐⭐⭐⭐",
            "Decision Tree ⭐⭐⭐⭐",
            "Linear Regression ⭐⭐⭐⭐"
        ])
        else:
            algorithms.extend([
            "Logistic Regression ⭐⭐⭐⭐",
            "Decision Tree ⭐⭐⭐⭐"
        ])

    # -----------------------------
    # Suggested Target Columns
    # -----------------------------
        target_columns = numeric_columns[:3]

    # -----------------------------
    # Next Action
    # -----------------------------
        if score >= 90:
            next_action = "Dataset is ready for Machine Learning."
        elif score >= 70:
          next_action = "Perform recommended cleaning before training."
        else:
          next_action = "Improve data quality before analysis."

        return {
        "health_score": score,

        "dataset_summary": {
            "rows": stats["rows"],
            "columns": stats["columns"],
            "numeric_columns": len(numeric_columns),
            "categorical_columns": len(categorical_columns),
        },

        "quality": {
            "missing_values": missing["total_missing"],
            "duplicate_rows": duplicates["duplicate_rows"],
            "outliers": sum(outliers.values()),
        },

        "recommendations": recommendations,

        "recommended_algorithms": algorithms,

        "suggested_targets": target_columns,

        "next_action": next_action,
    }