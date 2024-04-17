import React, {useEffect, useState} from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {Menu, Spin} from 'antd';
import axios from "axios";
import CryptocurrencyCard, {dictionaryToList} from "./components/CryptoCard.jsx";
import Converter from "./components/Converter.jsx";
import Chart from "./components/Chart.jsx";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const App = () => {
  const [currencies, setCurrencies] = useState([])
  const [currencyId, setCurrencyId] = useState(1)
  const [currencyData, setCurrencyData] = useState(null)
  const [fiats, setFiats] = useState([])
  const [graphData, setGraphData] = useState(null)
  const [currentFiat, setCurrentFiat] = useState(
    {2781: {
    "name": "United States Dollar",
    "rus": "Доллар США",
    "sign": "$",
    "symbol": "USD"
}})



  const fetchCurrencies = () => {
    axios.get('http://127.0.0.1:8000/currency').then(r => {
      const currenciesResponse = r.data
      const menuItems = [
        getItem('Список криптовалют', 'g1', null,
          currenciesResponse.map(c => {
            return {label: c.name, key: c.id}
          }),
          'group'
        )
      ]
      setCurrencies(menuItems)
    })
  }

  const fetchFiats = () => {
    axios.get(`http://127.0.0.1:8000/currency/fiat`).then(r => {
      setFiats(r.data)
    })
  }

  const fetchCurrency = () => {
    axios.get(`http://127.0.0.1:8000/currency/${currencyId}?convert_id=${Object.keys(currentFiat)[0]}`).then(r => {
      setCurrencyData(r.data)
    })
  }

  const fetchGraph = () => {
    axios.get(`http://127.0.0.1:8000/currency/graph/${currencyId}?convert_id=${Object.keys(currentFiat)[0]}`).then(r => {
      setGraphData(r.data)
    })
  }

  useEffect(() => {
    setCurrencyData(null)
  }, [currencyId]);

  useEffect(() => {
    fetchCurrency()
    fetchGraph()
  }, [currencyId, currentFiat]);

  useEffect(() => {
    fetchCurrencies()
    fetchFiats()
  }, []);


  const onClick = (e) => {
    setCurrencyId(e.key)
  };

  return (
    <div className='main-container mx-auto my-auto'>
      <div>
        {currencies.length > 0 && !Array.isArray(fiats) ? <Converter currencies={currencies} fiats={fiats} /> : <Spin size="large"/>}
      </div>
      <div className="flex">
        <Menu
          onClick={onClick}
          style={{
            width: 256,
          }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={currencies}
          className="h-screen overflow-scroll text-lg side-menu"
        />
        <div className="mx-auto my-auto w-full flex flex-col items-center pt-10">
          <div>
            {currencyData ? <CryptocurrencyCard currency={currencyData} fiats={fiats} currentFiat={{currentFiat, setCurrentFiat}}/> : <Spin size="large"/>}
          </div>
        <div className='chart-box'>
          {graphData ? <Chart currencyData={graphData} className='chart'/> : <Spin size="large"/>}
        </div>
        </div>
      </div>
    </div>
  );
};
export default App;