document.getElementById('search-form').addEventListener('submit', searchCity);

const apiKey = 'c5c492606c2d753c67314dbe344b9f50';

// API
function fetchWeatherForecast(lat, lon) {
    const forecastApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('weatherForecast', JSON.stringify(data));
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
                console.log(`${cityName}: Lat ${lat}, Lon ${lon}`);

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
    let cityName = cityInput.value;

    getCoordinatesForCity(cityName);

}