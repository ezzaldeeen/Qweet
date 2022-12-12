import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from utils.config import AppConfig
from routes import tweets

# instantiate fastapi application
app = FastAPI(title="Tweets Retrieving Service")
# adding middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# instantiate application's configuration
config = AppConfig.instance()

# include routers
app.include_router(router=tweets.router)

if __name__ == '__main__':
    uvicorn.run(app, port=config.svc_port)
