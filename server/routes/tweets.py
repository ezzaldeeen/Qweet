from typing import Tuple

from fastapi import APIRouter, status

from models.requests.tweet import TweetReq

router = APIRouter(prefix="/v1/tweets", tags=["tweets"])


@router.get("", status_code=status.HTTP_200_OK)
def get_tweets(tweet: TweetReq) -> dict:
    """
    Get tweets based on the given text,
    coordinates (latitude, longitude),
    and time interval (start timestamp, end timestamp)
    :param tweet: [str] tweet request model
    :return: [dict] the response body
    """
    return {
        "msg": "ok"
    }
