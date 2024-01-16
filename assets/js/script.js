const apiKey = 'c5c492606c2d753c67314dbe344b9f50';

const city = 'London';

function getCoordinatesForCity(cityName) {
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(geocodingApiUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          console.log(`${cityName}: Lat ${lat}, Lon ${lon}`);
         
        } else {
          console.log(`No coordinates found for the specified city. ${cityName}`);
        }
      })
      .catch(error => {
        console.error('Error fetching coordinates:', error);
      });
  }
  

  getCoordinatesForCity(city);