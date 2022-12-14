from typing import Callable, Any, Tuple

from elasticsearch import Elasticsearch, exceptions

from models.requests.tweet import TweetReq
from libs.es.query_builder import build_search_query
from utils.config import AppConfig


class TweetRepo:
    """
    Tweet repository responsible to communicate
    with the Elasticsearch, and perform retrieve operations
    against the tweets index
    """
    def __init__(self, es, config: AppConfig):
        self.__es = es
        self.__config = config
        self.__es_index = "tweets"

    def __get_connection(self) -> Elasticsearch:
        """
        Establish new Elasticsearch connection
        :return: [Elasticsearch] connection
        """
        return self.__es(self.__config.db_host,
                         http_auth=("elastic", self.__config.db_pass))

    def get(self, tweet: TweetReq) -> dict:
        """
        Get tweets from the Elasticsearch based on the given fields
        :param tweet: [str] tweet request model
        :return: [dict] Elasticsearch response body
        """
        # open new connection with ES
        conn = self.__get_connection()
        try:
            generated_query = build_search_query(tweet)
            response = conn.search(index=self.__es_index,
                                   body=generated_query)
            return response

        except exceptions.ConnectionError as error:
            raise error

        finally:
            # close ES connection
            conn.close()
