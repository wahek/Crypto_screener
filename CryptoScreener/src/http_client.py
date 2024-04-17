from aiohttp import ClientSession
from async_lru import alru_cache


class HttpClient:
    """
    Initialize the session class to access the external API, with the given base URL and API key.

    Parameters:
        base_url (str): The base URL for the API.
        api_key (str): The API key for authentication.
    """
    def __init__(self, base_url: str, api_key: str):
        self.session = ClientSession(
            base_url=base_url,
            headers={'X-CMC_PRO_API_KEY': api_key}
        )


class CMCHTTPClient(HttpClient):
    @alru_cache(ttl=3600)
    async def get_listings(self) -> list:
        """
        The function to get the latest listings (100 popular cryptocurrencies).
        :return:
            list(dict): A list of dictionaries containing the latest listings.
        """
        async with self.session.get('/v1/cryptocurrency/listings/latest') as response:
            res = await response.json()
            return res['data']

    @alru_cache(ttl=60)
    async def get_currency(self, currency_id: int | str, convert_id: int = 2781) -> dict:
        """
        The function to retrieve currency information.

        Args:
            currency_id (str): The currency ID, or several comma-separated currency IDs(1,2,248...).
            convert_id (int): The conversion ID. Defaults to 2781(USD).

        :return:
            dict: A dictionary containing the currency information.
        """
        async with self.session.get(
                '/v2/cryptocurrency/quotes/latest',
                params={'id': currency_id, 'convert_id': convert_id}) as response:
            res = await response.json()
            return res['data'][str(currency_id)]

    @alru_cache(ttl=60)
    async def get_convert(self, amount: float, currency_id: int, convert_id: int = 2781) -> dict:
        """
        This function accesses an external API to get a conversion from one currency to another.
        Args:
            amount (float): The amount to convert.
            currency_id (str): The currency for exchange ID .
            convert_id (int): The currency to convert into ID. Defaults to 2781(USD).

        :return:
            dict: Information about the conversion.
        """

        async with self.session.get(
                '/v2/tools/price-conversion',
                params={'amount': amount, 'id': currency_id, 'convert_id': convert_id}) as response:
            res = await response.json()
            return res['data']

    @alru_cache(ttl=3600)
    async def get_fiat(self):
        """
        (Deprecated)
        The function calls an external API to obtain a complete list of fiat currencies
        """
        async with self.session.get('/v1/fiat/map') as response:
            res = await response.json()
            return res['data']
