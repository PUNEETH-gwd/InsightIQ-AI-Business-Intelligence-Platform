import json
import os


class AssistantService:

    def chat(self, question: str):

        question = question.lower()

        report_path = "reports/latest_report.json"

        if not os.path.exists(report_path):
            return {
                "answer": (
                    "No analysis report found. "
                    "Please analyze a dataset first."
                )
            }

        with open(report_path, "r") as f:
            report = json.load(f)

        summary = report["dataset_summary"]

        if "rows" in question:
            return {
                "answer": (
                    f"The dataset contains "
                    f"{summary['rows']} rows."
                )
            }

        if "columns" in question:
            return {
                "answer": (
                    f"The dataset contains "
                    f"{summary['columns']} columns."
                )
            }

        if "target" in question:
            return {
                "answer": (
                    f"The selected target column is "
                    f"{summary['target_column']}."
                )
            }

        if "problem" in question:
            return {
                "answer": (
                    f"This is a "
                    f"{summary['problem_type']} problem."
                )
            }

        return {
            "answer":
            "I can answer questions about your dataset and AI report."
        }