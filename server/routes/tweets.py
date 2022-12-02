from fastapi import APIRouter, status

router = APIRouter(prefix="/v1/tweets", tags=["tweets"])


@router.get("", status_code=status.HTTP_200_OK)
def get_tweets():
    return {
        "msg": "ok"
    }
