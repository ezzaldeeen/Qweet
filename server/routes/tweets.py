from fastapi import APIRouter, status, Response
from elasticsearch import Elasticsearch, exceptions

from models.requests.tweet import TweetReq
from repos.tweets import TweetRepo
from utils.config import AppConfig

# instantiate api router
router = APIRouter(prefix="/v1/tweets", tags=["tweets"])
# getting app's configuration
config = AppConfig.instance()
# instantiate tweet repository
tweets_repo = TweetRepo(Elasticsearch, config.db_host)


@router.post("", status_code=status.HTTP_200_OK)
def get_tweets(tweet: TweetReq, res_model: Response) -> dict:
    """
    Get tweets based on the given text,
    coordinates (latitude, longitude),
    and time interval (start timestamp, end timestamp)
    :param tweet: [str] tweet request model
    :param res_model: [Response] response model
    :return: [dict] the response body
    """
    try:
        response = tweets_repo.get(tweet)
        return {
            "msg": "Tweets retrieved successfully",
            "response": response
        }

    except exceptions.ConnectionError as error:
        res_model.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "msg": "There's no connection with the Elasticsearch",
            "err": str(error)
        }
