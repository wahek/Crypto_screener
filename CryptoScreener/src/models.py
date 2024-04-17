from pydantic import BaseModel
from src.variable import FIAT


class Converter(BaseModel):
    amount: float
    currency_id: int
    convert: list
    price: list

    def converting(self):
        return round(self.price[0]['price'], 8)


class Graph(BaseModel):
    currency: dict
    fiat: dict = FIAT

    def recalculate_currency_by_graph(self):
        res = dict()
        currency_id = list(self.currency['quote'].keys())[0]
        res['slug'] = self.currency['symbol']
        res['sign'] = self.fiat[int(currency_id)]['sign']
        res['symbol'] = self.fiat[int(currency_id)]['symbol']
        temp_currency = self.currency['quote'][currency_id]
        res['market_cap_dominance'] = temp_currency['market_cap_dominance']
        res['volume_24h'] = temp_currency['volume_24h']
        res['volume_change_24h'] = temp_currency['volume_change_24h']
        res['volume_prev'] = res['volume_24h'] / (1 + res['volume_change_24h']/100)
        res['volume_change_24h'] = 1 - (res['volume_prev'] / res['volume_24h'])
        res['price'] = dict()
        res['price']['now'] = temp_currency['price']
        res['price']['7d'] = res['price']['now'] / (1 + temp_currency['percent_change_7d']/100)
        res['price']['30d'] = res['price']['now'] / (1 + temp_currency['percent_change_30d'] / 100)
        res['price']['60d'] = res['price']['now'] / (1 + temp_currency['percent_change_60d'] / 100)
        res['price']['90d'] = res['price']['now'] / (1 + temp_currency['percent_change_90d'] / 100)
        return res
