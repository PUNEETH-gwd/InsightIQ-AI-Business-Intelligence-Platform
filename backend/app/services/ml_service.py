import os
import joblib
import pandas as pd
import json

from sklearn.model_selection import train_test_split

# Regression
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

# Classification
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error,
    accuracy_score,
)
class MLService:


    def detect_problem_type(self, df, target_column):

      target = df[target_column]

    # Numeric target
      if pd.api.types.is_numeric_dtype(target):

        # Small number of unique values
        if target.nunique() <= 10:
            return "classification"

        return "regression"

      return "classification"

    def train_regression_models(
    self,
    X_train,
    X_test,
    y_train,
    y_test,
):
       models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(random_state=42),
        "Random Forest": RandomForestRegressor(
            random_state=42,
            n_estimators=100,
        ),
    }

       results = []

       best_model = None
       best_score = float("-inf")

       for name, model in models.items():

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        score = r2_score(y_test, predictions)

        results.append({
            "algorithm": name,
            "r2_score": round(score, 4),
            "mae": round(
                mean_absolute_error(y_test, predictions),
                4,
            ),
            "mse": round(
                mean_squared_error(y_test, predictions),
                4,
            ),
            "rmse": round(
                mean_squared_error(
                    y_test,
                    predictions,
                ) ** 0.5,
                4,
            ),
        })

        if score > best_score:
            best_score = score
            best_model = (name, model)

       return results, best_model
    
    def train_classification_models(
    self,
    X_train,
    X_test,
    y_train,
    y_test,
):
       models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(
            random_state=42,
            n_estimators=100,
        ),
    }

       results = []

       best_model = None
       best_score = -1

       for name, model in models.items():

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        score = accuracy_score(y_test, predictions)

        results.append({
            "algorithm": name,
            "accuracy": round(score, 4),
        })

        if score >= best_score:
            best_score = score
            best_model = (name, model)

       return results, best_model

    def train_model(
    self,
    dataset_path,
    target_column,
):

    # Load dataset
      df = pd.read_csv(dataset_path)

    # Keep rows without missing values
      df = df.dropna()

    # Detect problem type
      problem_type = self.detect_problem_type(
        df,
        target_column,
    )

    # Keep only numeric columns for regression
      if problem_type == "regression":
        df = df.select_dtypes(include=["number"])

      if target_column not in df.columns:
        raise ValueError(
            "Target column not found."
        )

      X = df.drop(columns=[target_column])
      X=pd.get_dummies(X)
      y = df[target_column]

      X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

      if problem_type == "regression":

        results, best = self.train_regression_models(
            X_train,
            X_test,
            y_train,
            y_test,
        )

      else:
        results, best = self.train_classification_models(
            X_train,
            X_test,
            y_train,
            y_test,
        )

      best_name, best_model = best

      os.makedirs(
        "trained_models",
        exist_ok=True,
    )

      model_path = os.path.join(
          "trained_models",
          "best_model.pkl",
      )

      joblib.dump(
          {
              "model": best_model,
              "columns": X.columns.tolist(),
              "problem_type": problem_type,
          },
          model_path,
      )

      # Save AutoML results for PDF generation

      os.makedirs(
          "reports",
          exist_ok=True,
      )

      report_path = os.path.join(
          "reports",
          "automl_result.json",
      )

      automl_report = {
          "problem_type": problem_type,
          "best_model": best_name,
          "all_models": results,
      }

      with open(
          report_path,
          "w",
      ) as file:
          json.dump(
              automl_report,
              file,
              indent=4,
          )

      return {
          "problem_type": problem_type,
          "best_model": best_name,
          "all_models": results,
          "model_path": model_path,
      }


    def generate_ai_report(
    self,
    dataset_id,
    dataset_name,
    target_column,
    problem_type,
    quality_report,
    automl_result,
):
      report = {}

    # Dataset Summary
      report["dataset_summary"] = {
        "dataset_name": dataset_name,
        "rows": quality_report["statistics"]["rows"],
        "columns": quality_report["statistics"]["columns"],
        "target_column": target_column,
        "problem_type": problem_type,
    }

    # Data Quality
      report["data_quality"] = {
        "missing_values": quality_report["missing_values"]["total_missing"],
        "duplicates": quality_report["duplicates"]["duplicate_rows"],
        "outliers": quality_report["outliers"],
    }

    # Model Comparison
      report["models"] = automl_result["all_models"]

    # Best Model
      report["best_model"] = automl_result["best_model"]

      explanation = []

      explanation.append(
        f'The target column "{target_column}" was identified as a {problem_type} problem.'
    )

      explanation.append(
        f'{automl_result["best_model"]} achieved the best performance among all tested models.'
    )

      report["explanation"] = explanation

      suggestions = []

      if quality_report["missing_values"]["total_missing"] > 0:
        suggestions.append(
            "Fill missing values before training."
        )

      if quality_report["duplicates"]["duplicate_rows"] > 0:
        suggestions.append(
            "Remove duplicate rows."
        )

      if len(quality_report["outliers"]) > 0:
        suggestions.append(
            "Review columns containing outliers."
        )

      suggestions.append(
        "Collect more data to improve model performance."
    )

      report["suggestions"] = suggestions
      os.makedirs("reports", exist_ok=True)

      os.makedirs("reports", exist_ok=True)

      report_path = os.path.join(
    "reports",
    f"{dataset_id}_report.json",
)

      with open(report_path, "w") as f:
        json.dump(
        report,
        f,
        indent=4,
    )
        json.dump(
        report,
        f,
        indent=4,
    )

      return report
    
    def predict(
        self,
        model_path,
        dataset_path,
):
        saved = joblib.load(model_path)

        model = saved["model"]
        feature_columns = saved["columns"]

    # Keep original dataset
        original_df = pd.read_csv(dataset_path)

    # Create encoded copy for prediction
        df = pd.get_dummies(original_df)

        df = df.reindex(
        columns=feature_columns,
        fill_value=0,
    )

        predictions = model.predict(df)

    # Add predictions to original data
        result_df = original_df.copy()
        result_df["Prediction"] = predictions

        output_dir = "predictions"
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(
        output_dir,
        "predictions.csv",
    )

        result_df.to_csv(
        output_path,
        index=False,
    )

        preview = result_df.head(10).to_dict(
        orient="records"
    )

        return {
        "rows": len(result_df),
        "prediction_file": output_path,
        "preview": preview,
    }


    def train_linear_regression(
        self,
        dataset_path,
        target_column,
    ):
        df = pd.read_csv(dataset_path)

        # Keep only numeric columns
        df = df.select_dtypes(include=["number"])

        if target_column not in df.columns:
            raise ValueError(
                "Target column must be numeric."
            )

        X = df.drop(columns=[target_column])
        y = df[target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
        )

        model = LinearRegression()

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        model_dir = "trained_models"

        os.makedirs(model_dir, exist_ok=True)

        model_path = os.path.join(
            model_dir,
            "linear_regression.pkl"
        )

        joblib.dump(model, model_path)

        return {
            "algorithm": "Linear Regression",
            "r2_score": round(
                r2_score(y_test, predictions),
                4,
            ),
            "mae": round(
                mean_absolute_error(
                    y_test,
                    predictions,
                ),
                4,
            ),
            "mse": round(
                mean_squared_error(
                    y_test,
                    predictions,
                ),
                4,
            ),
            "rmse": round(
                mean_squared_error(
                    y_test,
                    predictions,
                ) ** 0.5,
                4,
            ),
            "model_path": model_path,
        }