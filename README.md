# Qweet - Exploratory Spatio-temporal Analysis of Twitter Stream

## Overview

The idea from this project is to index a continuous stream of Tweets into the Elasticsearch, and perform a queries against the index to retrieve the most relevant tweets to the query, and visualize them on a map canvas with a heatmap that represents the scores of the reasults.

## Infrastructure

[![Untitled.png](https://i.postimg.cc/SK8H1vdh/Untitled.png)](https://postimg.cc/DWvC85Rj)

## Server-Side

- **FastAPI** as a framework to build the service that has a RESTfull endpoints that responsible to communicate with the Elasticsearch, and retrieve the most relevant Tweets to the given query parameters.
- **elasticsearch-py** the official low-level client for Elasticsearch that provides common ground for all Elasticsearch-related code in Python.
- **Elasticsearch DSL** high-level library whose aim is to help with writing and running queries against Elasticsearch. It is built on top of the official low-level client.
- **pydantic** for data validation and settings management.
- **ES CLI** in order to create an index with the given mapping, and to perform a bulk inseration operation to the Elasticsearch.

## Client-Side

- **LeafletJS** an open-source JavaScript library for interactive map, it also provides a useful plugins that I did used them in order to draw the coordinates of the tweets, the a heatmap that represents the density of a tweets in a specific area on the map.
- **Leaflet.heat** a tiny, simple and fast Leaflet heatmap plugin. Uses simpleheat under the hood, additionally clustering points into a grid for performance.
- **Leaflet.draw** adds support for drawing and editing vectors and markers on Leaflet maps.

## Screenshot

[![Untitled-1.png](https://i.postimg.cc/MpghDSy5/Untitled-1.png)](https://postimg.cc/G4J7L6gT)
