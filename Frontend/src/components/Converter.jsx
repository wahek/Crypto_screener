import { useEffect, useState } from 'react';
import { SwapOutlined } from '@ant-design/icons';
import { Button, Flex} from 'antd';

import { Select, Space, Input } from 'antd';

import axios from "axios";

const onSearch = (value) => {
};

const converting = async (amount, currencies) => {
  if (amount === undefined) {
    amount = { amountEx: 1 };
  }
  try {
    const response = await axios.get(`http://127.0.0.1:8000/currency/convert?amount=${amount.amountEx}&currency_id=${Object.values(currencies[0])[0]}&convert_id=${Object.values(currencies[1])[0]}`);
    
    const data = response.data;
    
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
};

const iterCurrencies = (currencies) => {
  let options = [];
  for (let [key, value] of Object.entries(currencies)) {
    options.push({ 'value': value['key'], 'label': value['label']})
  }
  return options
}

const iterFiats = (fiats) => {
  let options = [];
  for (let [key, value] of Object.entries(fiats)) {
    options.push({ 'value': key, 'label': value['symbol']})
  }
  return options
}

const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
function Converter({ currencies, fiats }) {

  const [reverse, setReverse] = useState(false);
  const [loadings, setLoadings] = useState([]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };
  const fiatList = iterFiats(fiats)
  const CurrencyList = iterCurrencies(currencies[0]['children'])
  const toggleReverse = () => {
    setReverse(!reverse);
    setIsReversed(!isReversed);
  };

  const [isReversed, setIsReversed] = useState(false);
  const [inputToken, setInputToken] = useState(CurrencyList[0]['value']);
  const [inputFiat, setInputFiat] = useState(fiatList[0]['value']);
  const [outputValue, setOutputValue] = useState(converting(undefined, [{inputToken}, {inputFiat}]).data);
  const [convFiat, setConvFiat] = useState(fiatList[0]['label']);
  const [convToken, setConvToken] = useState(CurrencyList[0]['label']);

  const [amountEx, setAmountEx] = useState(1.0);
  const onChangeCurrency = (value, label) => {
    setInputToken(value)
    setConvToken(label['label'])
  };
  const onChangeFiat = (value, label) => {
    setInputFiat(value)
    setConvFiat(label['label'])
  };

  const handleClick = () => {
    converting({amountEx}, isReversed ? [{inputFiat}, {inputToken}] : [{inputToken}, {inputFiat}])
      .then((data) => {
        console.log(data,)
        setOutputValue(data);
        enterLoading(0);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных:', error);
      });
  };

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    setOutputValue
  },[converting])

  return(
    <div>
      <div className='flex gap-5 converter'>
          <Space.Compact>
            <Input disabled 
              style={{
                height: '40px',
                width: '204px',
                fontSize: '18px',
                wordWrap: 'break-word',
              }}
              defaultValue="Количество"
            />
            <Input id='input-amount'
              style={{
                height: '40px',
                minWidth: '200px',
                fontSize: '20px',
              }}
              onChange={amountEx => setAmountEx(amountEx.target.value)}
              defaultValue='1.0'
            />
          </Space.Compact>
        <div>
          <div className={`flex gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
            <Select
              id='select-body__currency'
              className='select-body'
              size='large'
              showSearch
              placeholder="Выбирете токен"
              optionFilterProp="children"
              onChange={onChangeCurrency}
              onSearch={onSearch}
              filterOption={filterOption}
              defaultValue={CurrencyList[0]}
              options={CurrencyList}
            />
            <Flex gap="small" wrap="wrap">
              <Button danger icon={<SwapOutlined />}size="large" onClick={toggleReverse}/>
            </Flex>
            <Select
              id='select-body__fiat'
              className='select-body'
              size='large'
              showSearch
              placeholder="Выбирете валюту"
              optionFilterProp="children"
              onChange={onChangeFiat}
              onSearch={onSearch}
              filterOption={filterOption}
              defaultValue={fiatList[0]}
              options={fiatList}
            />
          </div>
        <div>
          <div className='flex gap-5 justify-center mt-2'>
                <Flex gap="small" wrap="wrap">
                <Button className='button-calc' type="primary" loading={loadings[0]} shape="round" 
onClick={handleClick} 
             size='large'>
              Рассчитать
            </Button>
          </Flex>
          </div>
        </div>
        </div>
        <div>
          <Space.Compact>
            <Input id='output-amount'
              disabled
              style={{
                height: '40px',
                width: '310px',
                fontSize: '20px',
                color: 'black',
              }}
              value={outputValue}
            />
            <Input disabled 
              style={{
                height: '40px',
                width: '144px',
                fontSize: '18px',
                wordWrap: 'break-word',
              }}
              value={isReversed ? convToken : convFiat}
            />
          </Space.Compact>
        </div>
      </div>
    </div>
  )
};
export default Converter;
