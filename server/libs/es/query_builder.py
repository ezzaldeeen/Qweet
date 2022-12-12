from elasticsearch_dsl import Search, Q

from models.requests.tweet import TweetReq


def build_search_query(tweet: TweetReq) -> dict:
    """
    Build ES search query based on the given fields
    :param tweet: [TweetReq] tweet request model
    :return: [dict] generated search query
    """
    match_id_clause = Q("match", text=tweet.text)
    range_date_clause = Q("range", created_at={
        "format": "strict_date_optional_time",
        "gte": tweet.start_at,
        "lte": tweet.end_at
    })
    geo_bounding_box_clause = Q("geo_bounding_box", coordinates={
        "top_left": {
            "lat": tweet.top_left_lat,
            "lon": tweet.top_left_lon
        },
        "bottom_right": {
            "lat": tweet.bottom_right_lat,
            "lon": tweet.bottom_right_lon
        }
    })
    generated_query = Search().query("bool", must=[
        match_id_clause,
        range_date_clause,
        geo_bounding_box_clause
    ]).to_dict()
    # pagination
    # todo: hard coded!!!
    generated_query['size'] = 1000

    return generated_query
