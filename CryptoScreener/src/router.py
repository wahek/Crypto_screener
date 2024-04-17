from typing import List

from fastapi import APIRouter

from src.http_client import CMCHTTPClient
from src.config import settings
from src.models import Converter, Graph
from src.variable import FIAT

cmc_client = CMCHTTPClient(
    base_url='https://pro-api.coinmarketcap.com',
    api_key=settings.CMC_API_KEY
)

cmc_router = APIRouter(prefix='/currency')


@cmc_router.get('')
async def get_listings() -> List[dict]:
    """
    The function to get the latest listings (100 popular cryptocurrencies).
    :return:
        list(dict): A list of dictionaries containing the latest listings.
    """
    return await cmc_client.get_listings()


@cmc_router.get('/fiat')
async def get_listings() -> dict:
    """
    A coroutine function that retrieves a list of static fiat currencies -> src\\variable.py.
    """
    return FIAT


@cmc_router.get('/convert')
async def get_convert(amount: float, currency_id: int, convert_id: int = 2781):
    """
     A coroutine function that retrieves conversion rates from a CMC client and performs a currency conversion.
    :param amount:(float) The amount to be converted.
    :param currency_id: (int) The ID of the currency to convert.
    :param convert_id: (int, optional) The ID of the currency to convert to. Defaults to 2781(USD).
    :return:
        float: The converted amount.
    """

    resp = await cmc_client.get_convert(amount, currency_id, convert_id)
    converter = Converter(
        amount=resp['amount'],
        currency_id=resp['id'],
        convert=resp['quote'].keys(),
        price=resp['quote'].values()
    )
    return converter.converting()


@cmc_router.get('/list/{currency_id}')
async def get_currency_list(currency_id: str, convert_id: int = 2781) -> dict:
    """
    A coroutine function that retrieves currency information from a CMC client.
    :param currency_id: (str) The currency ID, or several comma-separated currency IDs(1,2,248...).
    :param convert_id: (int) The conversion ID. Defaults to 2781(USD).
    :return: (dict) A dictionary containing the currency information.
    """
    return await cmc_client.get_currency(currency_id, convert_id)


@cmc_router.get('/graph/{currency_id}')
async def get_graph_by_currency(currency_id: int, convert_id: int = 2781) -> dict:
    """
    A function that retrieves currency information from a CMC client
    and recalculates information about the currency to build a graph.
    :param currency_id: (int) The currency ID
    :param convert_id: (int) The conversion ID. Defaults to 2781(USD).
    :return: (dict) A dictionary containing the currency information about change value(for graphics).
    """

    return Graph(currency=await cmc_client.get_currency(currency_id, convert_id)).recalculate_currency_by_graph()


@cmc_router.get('/{currency_id}')
async def get_currency(currency_id: int, convert_id: int = 2781) -> dict:
    """
    A coroutine function that retrieves currency information from a CMC client.
    :param currency_id: (int) The currency ID.
    :param convert_id: (int) The conversion ID. Defaults to 2781(USD).
    :return: (dict) A dictionary containing the currency information.
    """
    return await cmc_client.get_currency(currency_id, convert_id)
