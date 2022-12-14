from typing import Optional

from pydantic import BaseModel


class TweetReq(BaseModel):
    """
    Request model for the tweet's criteria
    - text: [str] the content of the tweet
    - lat: [str] horizontal coordinate
    - lon: [str] vertical coordinate
    - start_at: [int] epoch millisecond
    - end_at: [int] epoch millisecond
    """
    text: str
    top_left_lat: float = 90
    top_left_lon: float = -180
    bottom_right_lat: float = -90
    bottom_right_lon: float = 180
    start_at: str = "2000-09-08T10:45:32.038Z"
    end_at: str = "2022-12-30T20:47:46.019Z"
