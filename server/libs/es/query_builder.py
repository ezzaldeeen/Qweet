from typing import Tuple

from elasticsearch_dsl import Search


def build_search_query(text: str,
                       lat: float,
                       lon: float,
                       interval: Tuple[int, int]) -> dict:
    """
    Build ES search query based on the given fields
    :return: [dict] generated search query
    """
    pass
