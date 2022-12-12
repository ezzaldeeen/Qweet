from typing import Optional

from pydantic import BaseModel


class TweetRes(BaseModel):
    """
    Response model for the tweet's criteria
    - text: [str] the content of the tweet
    - lat: [str] horizontal coordinate
    - lon: [str] vertical coordinate
    - start_at: [int] epoch millisecond
    - end_at: [int] epoch millisecond
    """
    text: str
    top_left_lat: Optional[float]
    top_left_lon: Optional[float]
    bottom_right_lat: Optional[float]
    bottom_right_lon: Optional[float]
    start_at: Optional[str]
    end_at: Optional[str]
