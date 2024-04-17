import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, ArcElement, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, scales, Ticks } from 'chart.js';
import { callback, color } from 'chart.js/helpers';

ChartJS.register(CategoryScale, BarElement, LinearScale, ArcElement, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function Chart({ currencyData }) {

  const options = (chartName) => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: chartName,
      },
      
    },
    
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            if (Math.abs(value) >= 1.0e+9) {
              return currencyData['sign']+(value / 1.0e+9).toFixed(1) + 'B'; // Миллиарды
            } else if (Math.abs(value) >= 1.0e+6) {
              return currencyData['sign']+(value / 1.0e+6).toFixed(1) + 'M'; // Миллионы
            } else if (Math.abs(value) >= 1.0e+3) {
              return currencyData['sign']+(value / 1.0e+3).toFixed(1) + 'K'; // Тысячи
            } else {
              return value.toLocaleString('ru-RU', { style: 'currency', currency: currencyData['symbol'] });
            }
          }
        },
      }
    }
  });
  

  
  // Извлекаем метки и значения из JSON
  const labels = Object.keys(currencyData['price']).reverse();
  const dataValues = Object.values(currencyData['price']).reverse();

  // Создание объекта конфигурации графика
  const data = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: 'Цена',
        data: dataValues,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],

  
  };

  const labelsVertical = ['Предидущий объём', 'Объём за 24 часа']
  const dataVerticalValues = [currencyData['volume_prev'], currencyData['volume_24h']]
  const valueDifferent = (currencyData['volume_change_24h']*100).toFixed(1)

  const dataVertical = {
    labels: labelsVertical,
    datasets: [
      {
        fill: true,
        label: 'Объём',
        data: dataVerticalValues,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],

  
  };

  const dataPie = {
    labels: ['Другие криптовалюты', currencyData['slug'], ],
    datasets: [
      {
        data: [100-currencyData['market_cap_dominance'], currencyData['market_cap_dominance'],],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };



  return (
    <div>
      <div className='ms- me-5 graph-main'>
        <Line options={options('График цены')} data={data} />
      </div>
        <div className='graph flex'>
          <div className='graph-graph graph-rel'>
          <Bar className='graph-graph' options={options('График объёма')}  style={{width: '35vw'}}  data={dataVertical} />
          <span className='graph-text' style={{color: valueDifferent > 0 ? 'green' : 'red'}}>{valueDifferent}%</span>
          </div>
          <div style={{height: '25vh'}}>
          <Doughnut className='graph-graph' style={{height: '30vh'}} data={dataPie} />
          </div>
          
        </div>
    </div>
      )
}
