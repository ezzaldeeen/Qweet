from typing import Callable, Any, Tuple

from elasticsearch import Elasticsearch


class TweetRepo:
    """
    Tweet repository responsible to communicate
    with the Elasticsearch, and perform retrieve operations
    against the tweets index
    """
    def __init__(self, es: Callable[[str], Any], db_host: str):
        self.__es = es
        self.__db_host = db_host

    def __get_connection(self) -> Elasticsearch:
        """
        Establish new Elasticsearch connection
        :return: [Elasticsearch] connection
        """
        return self.__es(self.__db_host)

    def get(self, text: str, lat: float, lon: float, interval: Tuple[int, int]) -> dict:
        """
        Get tweets from the Elasticsearch based on the given fields
        :param text: [str] tweets content
        :param lat: [float] horizontal coordinate
        :param lon: [float] vertical coordinate
        :param interval: [Tuple[int, int]] time interval epoch milliseconds
        :return: [dict] Elasticsearch response body
        """
        # open new connection with ES
        conn = self.__get_connection()
        try:
            response = conn.search
            return response
        except Exception as error:
            pass

        finally:
            # close ES connection
            conn.close()
