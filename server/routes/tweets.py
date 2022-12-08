from typing import Tuple

from fastapi import APIRouter, status

router = APIRouter(prefix="/v1/tweets", tags=["tweets"])


@router.get("", status_code=status.HTTP_200_OK)
def get_tweets(text: str,
               lat: float,
               lon: float,
               interval: Tuple[int, int]) -> dict:
    """
    Get tweets based on the given text,
    coordinates (latitude, longitude),
    and time interval (start timestamp, end timestamp)
    :param text: [str] tweets content
    :param lat: [float] horizontal coordinate
    :param lon: [float] vertical coordinate
    :param interval: [Tuple[int, int]] time interval epoch milliseconds
    :return: [dict] the response body
    """
    return {
        "msg": "ok"
    }
