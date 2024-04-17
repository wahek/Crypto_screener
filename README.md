<h1 align="center">Cкринер криптовалют</h1>
<hr>

<h3>Стек:</h3>
#### Backend
>![Static Badge](https://img.shields.io/badge/build-v3.11-brightgreen?style=flat-square&logo=python&label=python&labelColor=yellow&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v0.110.1-brightgreen?style=flat-square&logo=FastAPI&logoColor=black&label=FastAPI&labelColor=teal&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v2.6.4-brightgreen?style=flat-square&logo=Pydantic&logoColor=white&label=Pydantic&labelColor=deeppink&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v3.9-brightgreen?style=flat-square&logo=AIOHTTP&logoColor=fuchsia&label=AIOHTTP&labelColor=deepskyblue&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-API_v2-brightgreen?style=flat-square&logo=CoinMarketCap&logoColor=black&label=CoinMarketCap&labelColor=azure&color=aqua)
#### Frontend
>![Static Badge](https://img.shields.io/badge/build-v5.2-brightgreen?style=flat-square&logo=Vite&label=Vite&labelColor=palegreen&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v18.2-brightgreen?style=flat-square&logo=react&label=React&labelColor=palevioletred&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v5.2-brightgreen?style=flat-square&logo=antdesign&logoColor=orange&label=AntDesign&labelColor=slateblue&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v1.6-brightgreen?style=flat-square&logo=Axios&logoColor=darkorchid&label=Axios&labelColor=powderblue&color=aqua)
>![Static Badge](https://img.shields.io/badge/build-v5.2-brightgreen?style=flat-square&logo=chartdotjs&logoColor=white&label=react-chartjs-2&labelColor=black&color=aqua)

<img align="center" src="browser_GEAtKDNGAz.gif" alt="Демонстрация работы приложения">


Интерфейс приложения позволяет получать информацию о 100 наиболее ликвидных криптовалютах. Запрос с **frontend** идёт на 
___uvicorn___ где запущено приложение на ___FastAPI___. Затем **backend** отправляет запрос через ___AIOHTTP___ на
стороннее **API** ___CoinMarketCup___. Далее передаёт ответ **json объект** в ___JavaScript___.

При выборе конкретной криптовалюты из списка меню, выводится подробная информация о цене, капитализации, изменений цен
и объёмов. Имеется опция конвертации и выводе цены в конкретной фиатной валюте **($, €, ¥, ₽)** . Так же с **backend** 
в этот момент идёт запрос данных для построения графика. Так как ___CoinMarketCup___ возвращает только процентное 
изменение цены, то класс _Graph_ пересчитывает эти данные в _"плоские"_ числа. Затем уже по этим данным 
___react-chartjs-2___ отстраивает 3 графика: (График цены за 90 дней, график суточных объёмов текущих и прошлых,
График доминирования выбранной криптовалюты на рынке).

Интерфейс позволяет проводить конвертацию криптовалюты в фиатную валюту и наоборот. Функция поддерживает выбор всех 
криптовалют из меню, и 4 фиатные валюты **($, €, ¥, ₽)**




