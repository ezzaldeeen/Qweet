from datetime import datetime
from logging import Logger
from json import loads

from elasticsearch import Elasticsearch, exceptions
from elasticsearch.helpers import bulk


class Handler:
    """
    Elasticsearch handler encapsulate all the functionality
    in order to establish index with the pre-defined mapping,
    bulk insertion for the given documents.
    """
    def __init__(self,
                 index: str,
                 logger: Logger,
                 client: Elasticsearch) -> None:
        self.__index = index
        self.__logger = logger
        self.__client = client

    @staticmethod
    def __parse_date(date) -> float:
        """
        Convert the format of the given date
        :param date: given date
        :return: [str]: parsed date
        """
        in_format = "%a %b %d %H:%M:%S %z %Y"
        return datetime.strptime(date, in_format).timestamp()

    def __is_healthy(self) -> bool:
        """
        Check whether the cluster healthy or not
        status: Green, and Yellow adopted as healthy cluster
        """
        response = self.__client.cluster.health()
        if response["status"] in ["green", "yellow"]:
            return True
        return False

    def create(self, body: dict) -> None:
        """
        Wrapper method in order to create new index
        with the given mapping (schema)
        :param body: [dict] the pre-defined schema of the index
        :return: [dict] response body
        """
        try:
            mappings = body['mappings']
            settings = body['settings']
            if self.__is_healthy():
                response = self.__client.indices.create(index=self.__index,
                                                        mappings=mappings,
                                                        settings=settings)
                self.__logger.info(response)

        except exceptions.ConnectionError:
            self.__logger.error(
                "There's no connection with the Elasticsearch"
            )
            return

        except exceptions.BadRequestError as exception:
            self.__logger.error(exception.message)
            return

        except IOError as exception:
            self.__logger.error(exception)
            return

    def index(self, collection_path: str):
        """
        Wrapper method in order to perform bulk indexing operation
        :param collection_path: the path of the pre-defined documents
        :return: [dict] response body
        """
        def iterate():
            try:
                with open(collection_path) as file:
                    documents = file.read().splitlines()
            except IOError as exception:
                self.__logger.error(exception)
                return

            for document in documents:
                document = loads(document)
                document['created_at'] = Handler.__parse_date(document['created_at'])
                yield {
                    "_index": self.__index,
                    **document
                }
        try:
            if self.__is_healthy():
                response = bulk(client=self.__client, actions=iterate())
                self.__logger.info(response)

        except exceptions.ConnectionError:
            self.__logger.error(
                "There's no connection with the Elasticsearch"
            )
