import json
import logging
import sys

import click
from elasticsearch import Elasticsearch, exceptions

sys.path.append(".")

from libs.es.handler import Handler
from utils.config import AppConfig


@click.command()
@click.option('--index', '-i', default="tweets", type=str, help='Index Name')
@click.option('--shard', '-s', default=1, type=int, help='Number of Shards')
@click.option('--replica', '-r', default=0, type=int, help='Number of Replicas')
@click.option('--file', '-f', type=click.Path(exists=True), help='Path of Mapping file')
@click.option('--data', '-d', type=click.Path(exists=True), help='Path of data file')
def create_new_index(index: str, shard: int, replica: int, file: str, data: str) -> None:
    """
    Create new Elasticsearch index with the given settings, and mapping
    Args:
        - index: [str] the name of the index
        - shard: [int] number of shards
        - replica: [int] number of replicas
        - file: [path] path of the mapping file
        - data: [path] path of the data file
    Example:
        - python es.py -i tweets -s 1 -r 0 -f <relative/path/to/file_xxx.tmpl>
    """
    try:
        # number of shards must be more than zero
        if shard < 1:
            click.echo("number of shards must be greater than zero")
        # number of replica must be more or equal to zero
        if replica < 0:
            click.echo("number of replicas must be greater or equal to zero")

        # app's configuration
        config = AppConfig.instance()

        # create stream handler logging
        logging.basicConfig(level=config.log_level)
        logger = logging.getLogger()

        es_client = Elasticsearch(hosts=config.db_host,
                                  http_auth=("elastic", config.db_pass),
                                  timeout=30)
        handler = Handler(index=index, client=es_client, logger=logger)

        with open(file) as file_:
            body = json.loads(file_.read())

        # set the args to the mappings
        body['settings']['number_of_shards'] = shard
        body['settings']['number_of_replicas'] = replica
        # create new index
        handler.create(body=body)
        # bulk insertion
        handler.index(collection_path=data)

    except exceptions.ConnectionError:
        click.echo("there's no connection with the elasticsearch")


if __name__ == '__main__':
    create_new_index()
