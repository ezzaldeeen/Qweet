import uvicorn
from fastapi import FastAPI

from utils.config import AppConfig
from routes import tweets

# instantiate fastapi application
app = FastAPI(title="Tweets Retrieving Service")
# instantiate application's configuration
config = AppConfig.instance()

# include routers
app.include_router(router=tweets.router)

if __name__ == '__main__':
    uvicorn.run(app, port=config.svc_port)
