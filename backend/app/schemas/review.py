from pydantic import BaseModel
from typing import Optional

class ReviewActionRequest(BaseModel):
    comments: Optional[str] = ""
    reviewer_name: Optional[str] = "Finance Manager"
