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
    top_left_lat: Optional[float] = 40.73
    top_left_lon: Optional[float] = -108.35883
    bottom_right_lat: Optional[float] = 40.01
    bottom_right_lon: Optional[float] = -101.31067
    start_at: Optional[str] = "2013-09-08T10:45:32.038Z"
    end_at: Optional[str] = "2013-12-30T20:47:46.019Z"
