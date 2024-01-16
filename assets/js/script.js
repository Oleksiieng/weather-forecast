document.getElementById('search-form').addEventListener('submit', searchCity);
document.addEventListener('DOMContentLoaded', () => {
    getLocation();
    updateSearchHistoryDisplay();
    
});

const apiKey = 'c5c492606c2d753c67314dbe344b9f50';

function getLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {

            const { latitude, longitude } = position.coords;
            fetchWeatherForecast(latitude, longitude);
       
        }, error => {
            console.error('Geolocation error:', error);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}


function fetchWeatherForecast(lat, lon) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('weatherForecast', JSON.stringify(data));
            updateCurrentWeather(data);
            updateForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching weather forecast:', error);
        });
}


function getCoordinatesForCity(cityName) {
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeatherForecast(lat, lon);
            } else {
                console.log(`No coordinates found for the specified city. ${cityName}`);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}


function searchCity(event) {
    event.preventDefault();
    let cityInput = document.getElementById('search-input');
    let cityName = cityInput.value.trim();
    if (cityName) {
        getCoordinatesForCity(cityName);
        saveSearchHistory(cityName);
    }
}


function updateCurrentWeather(data) {
    let cityName = data.city.name;
    data = data.list[0];
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const weatherSection = document.querySelector('.result-section');
    const formattedDate = dayjs(data.dt_txt).format('DD/MM/YYYY');
    weatherSection.innerHTML = `
        <h2>${cityName} ${formattedDate}</h2>
        <img src="${iconUrl}" alt="Weather icon">
        <p>Temp: ${kelvinToCelsius(data.main.temp)} °C</p>
        <p>Wind: ${data.wind.speed} KPH</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}


function updateForecast(forecastData) {
    const forecastSection = document.querySelector('.forecast-section .row');

    const dailyForecast = forecastData.filter((forecast, index, arr) => {
        const day = dayjs(forecast.dt_txt).format('DD');
        if (index === 0 || day !== dayjs(arr[index - 1].dt_txt).format('DD')) {
            return true;
        }
        return false;
    }).slice(0, 5);

    forecastSection.innerHTML = dailyForecast.map(day => {
        const formattedDate = dayjs(day.dt_txt).format('DD/MM/YYYY');
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        return `
            <div class="col forecast-card text-center p-2">
                <h5>${formattedDate}</h5>
                <img src="${iconUrl}" alt="Weather icon">
                <p>Temp: ${kelvinToCelsius(day.main.temp)} °C</p>
                <p>Wind: ${day.wind.speed} KPH</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    }).join('');
}


function kelvinToCelsius(temp) {
    let celsius = temp - 273.15;
    if (celsius === 0) {
        return 0;
    }
    return celsius.toFixed(0);
}

function updateSearchHistoryDisplay() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryDiv = document.querySelector('.search-history .list-group');

    searchHistoryDiv.innerHTML = searchHistory.map(city => 
        `<a href="#" class="list-group-item list-group-item-action" onclick="searchHistoryClicked('${city}')">${city}</a>`
    ).join('');
}

function searchHistoryClicked(cityName) {
    document.getElementById('search-input').value = cityName;
    getCoordinatesForCity(cityName);
}


function saveSearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    updateSearchHistoryDisplay();
}
