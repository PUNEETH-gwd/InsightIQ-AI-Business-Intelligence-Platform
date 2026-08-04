from pydantic import BaseModel


class ChartRequest(BaseModel):
    chart_type: str
    x_axis: str
    y_axis: str