import json
import os

from sqlalchemy.orm import Session

from app.services.dataset.dataset_service import DatasetService
class AssistantService:

    def __init__(self, db: Session):
        self.db = db
        self.dataset_service = DatasetService(db)

    def chat(self, question: str, dataset_id: str):

        question = question.lower().strip()
        dataset = self.dataset_service.get_dataset(dataset_id)
        if dataset is None:
          return {
            "answer": "I couldn't find the selected dataset."
        }

        report_path = "reports/latest_report.json"

        report_path = "reports/latest_report.json"

        if not os.path.exists(report_path):
            return {
                "answer": (
                    "No analysis report is available yet. "
                    "Please upload and analyze a dataset first."
                )
            }

        try:
            with open(report_path, "r") as f:
                report = json.load(f)

        except Exception:
            return {
                "answer": (
                    "I couldn't read the latest analysis report."
                )
            }

        summary = report.get(
            "dataset_summary",
            {},
        )

        quality = report.get(
            "data_quality",
            {},
        )

        models = report.get(
            "models",
            [],
        )

        best_model = report.get(
            "best_model",
            "Not available",
        )

        explanations = report.get(
            "explanation",
            [],
        )

        suggestions = report.get(
            "suggestions",
            [],
        )

        # -----------------------------
        # Dataset information
        # -----------------------------

        if "row" in question:
            return {
                "answer": (
                    f"Your dataset contains "
                    f"{summary.get('rows', 'unknown')} rows."
                )
            }

        if "column" in question:
            return {
                "answer": (
                    f"Your dataset contains "
                    f"{summary.get('columns', 'unknown')} columns."
                )
            }

        if "target" in question:
            return {
                "answer": (
                    f"The target column is "
                    f"'{summary.get('target_column', 'unknown')}'."
                )
            }

        if (
            "problem type" in question
            or "regression" in question
            or "classification" in question
        ):
            return {
                "answer": (
                    f"This dataset is identified as a "
                    f"{summary.get('problem_type', 'unknown')} problem."
                )
            }

        # -----------------------------
        # Data quality
        # -----------------------------

        if "missing" in question:
            return {
                "answer": (
                    f"Your dataset has "
                    f"{quality.get('missing_values', 0)} "
                    f"missing values."
                )
            }

        if "duplicate" in question:
            return {
                "answer": (
                    f"Your dataset has "
                    f"{quality.get('duplicates', 0)} "
                    f"duplicate rows."
                )
            }

        if "outlier" in question:
            outliers = quality.get(
                "outliers",
                [],
            )

            if outliers:
                return {
                    "answer": (
                        "Outliers were detected in these columns:\n"
                        + "\n".join(
                            f"• {item}"
                            for item in outliers
                        )
                    )
                }

            return {
                "answer": "No outlier columns were reported."
            }

        # -----------------------------
        # Best model
        # -----------------------------

        if (
            "best model" in question
            or "performed best" in question
            or "best algorithm" in question
        ):

            answer = (
                f"The best model is "
                f"**{best_model}**."
            )

            if models:
                for model in models:
                    if model.get("algorithm") == best_model:

                        if "r2_score" in model:
                            answer += (
                                f"\n\nR² Score: "
                                f"{model['r2_score']}"
                            )

                        if "accuracy" in model:
                            answer += (
                                f"\n\nAccuracy: "
                                f"{model['accuracy']}"
                            )

                        break

            return {
                "answer": answer
            }

        # -----------------------------
        # Model comparison
        # -----------------------------

        if (
            "compare model" in question
            or "model comparison" in question
            or "models compared" in question
        ):

            if not models:
                return {
                    "answer":
                    "No model comparison results are available."
                }

            lines = ["Here are the AutoML results:\n"]

            for model in models:

                name = model.get(
                    "algorithm",
                    "Unknown",
                )

                if "r2_score" in model:
                    metric = (
                        f"R² = {model['r2_score']}"
                    )

                elif "accuracy" in model:
                    metric = (
                        f"Accuracy = {model['accuracy']}"
                    )

                else:
                    metric = "Metric unavailable"

                lines.append(
                    f"• {name}: {metric}"
                )

            return {
                "answer": "\n".join(lines)
            }

        # -----------------------------
        # AI explanation
        # -----------------------------

        if (
            "insight" in question
            or "explain" in question
            or "analysis" in question
        ):

            if explanations:
                return {
                    "answer": "\n".join(
                        f"• {item}"
                        for item in explanations
                    )
                }

            return {
                "answer":
                "No AI explanation is available yet."
            }

        # -----------------------------
        # Recommendations
        # -----------------------------

        if (
            "recommend" in question
            or "suggestion" in question
            or "improve" in question
            or "improvement" in question
        ):

            if suggestions:
                return {
                    "answer": "\n".join(
                        f"• {item}"
                        for item in suggestions
                    )
                }

            return {
                "answer":
                "No recommendations are available yet."
            }

        # -----------------------------
        # Complete summary
        # -----------------------------

        if (
            "summarize" in question
            or "summary" in question
            or "dataset overview" in question
        ):

            answer = (
                f"📊 Dataset Summary\n\n"
                f"Rows: {summary.get('rows', 'unknown')}\n"
                f"Columns: {summary.get('columns', 'unknown')}\n"
                f"Target: {summary.get('target_column', 'unknown')}\n"
                f"Problem Type: {summary.get('problem_type', 'unknown')}\n\n"
                f"Missing Values: "
                f"{quality.get('missing_values', 0)}\n"
                f"Duplicates: "
                f"{quality.get('duplicates', 0)}\n\n"
                f"Best Model: {best_model}"
            )

            return {
                "answer": answer
            }

        # -----------------------------
        # Default response
        # -----------------------------

        return {
            "answer": (
                "I can help you with:\n\n"
                "• Dataset summary\n"
                "• Rows and columns\n"
                "• Missing values\n"
                "• Duplicate rows\n"
                "• Outliers\n"
                "• Target column\n"
                "• Problem type\n"
                "• Best model\n"
                "• Model comparison\n"
                "• AI insights\n"
                "• Recommendations"
            )
        }