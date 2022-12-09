from typing import Callable, Any

from elasticsearch import Elasticsearch

from models.requests.tweet import TweetReq


class TweetRepo:
    """
    Tweet repository responsible to communicate
    with the Elasticsearch, and perform retrieve operations
    against the tweets index
    """
    def __init__(self, es: Callable[[str], Any], db_host: str):
        self.__es = es
        self.__db_host = db_host
        self.__es_index = "tweets"

    def __get_connection(self) -> Elasticsearch:
        """
        Establish new Elasticsearch connection
        :return: [Elasticsearch] connection
        """
        return self.__es(self.__db_host)

    def get(self, tweet: TweetReq) -> dict:
        """
        Get tweets from the Elasticsearch based on the given fields
        :param tweet: [str] tweet request model
        :return: [dict] Elasticsearch response body
        """
        # open new connection with ES
        conn = self.__get_connection()
        try:
            response = conn.search(index=self.__es_index,
                                   body={})
            return response
        except Exception as error:
            pass

        finally:
            # close ES connection
            conn.close()
