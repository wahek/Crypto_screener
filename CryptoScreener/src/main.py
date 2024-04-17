from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.http_client import CMCHTTPClient
from src.config import settings
from src.router import cmc_router

app = FastAPI()

app.include_router(cmc_router)

cmc_client = CMCHTTPClient(
    base_url='https://pro-api.coinmarketcap.com',
    api_key=settings.CMC_API_KEY
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
