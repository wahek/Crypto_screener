import {Card} from "antd";
import React, {useState} from "react";
import { Button, Flex } from 'antd';
import '../assets/style.css';
import numberWithCommas from "../utils.js";

export function dictionaryToList(dictionary) {
  return Object.keys(dictionary).map((key) => ({
    [key]: dictionary[key]
  }));
}


function CryptocurrencyCard({ currency, fiats, currentFiat }) {
  const currentfiatData = Object.values(Object.values(currentFiat)[0])[0];
  const quoteOb = Object.values(currency.quote)[0];

  const priceChangeColor = quoteOb.percent_change_24h > 0 ? 'text-green-400' : 'text-red-400'
  const formattedPrice = quoteOb.price.toFixed(2)
  const formattedMarketCap = numberWithCommas(Math.round(quoteOb.market_cap/1_000_000))
  const priceChange = Math.round(100 * quoteOb.percent_change_24h) / 100

  const fiats_list = dictionaryToList(fiats);


  const handleButtonClick = (fiatData) => {
    currentFiat.setCurrentFiat(fiatData);
  };

  return (
    <div className="container-shadow">
      <div className="card-container ">
        {fiats_list.map((fiat) => {
          const fiatKey = Object.keys(fiat)[0];
          const fiatData = {[fiatKey]:fiat[fiatKey]};
          const isActive = currentFiat === fiatData;
          return (
            <button 
            className={`button-fiat${isActive ? ' active' : ''}`} 
            title={fiatData.rus}
            type="disabled"
            key={fiatKey} 
            onClick={() => handleButtonClick(fiatData)}
            disabled={isActive}
            >
              {fiatData[fiatKey].symbol}
            </button>
          );
        })}
      </div>
      <Card
        title={
          <div className="flex items-center gap-3">
            <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`} alt='logo' width="50"/>
            <p className="text-3xl">{currency.name}</p>
          </div>
        }
        bordered={false}
        style={{
          height: 340,
        }}
        className="text-2xl"
      >
        <p>Текущая цена: {formattedPrice}{ currentfiatData.sign }</p>
        <span>Изменение цены за 24 часа: </span>
        <span className={priceChangeColor}>
        {priceChange}%
      </span>
        <p>Текущая капитализация: {currentfiatData.sign}{formattedMarketCap}M</p>
      </Card>
    </div>
  )
}

export default CryptocurrencyCard