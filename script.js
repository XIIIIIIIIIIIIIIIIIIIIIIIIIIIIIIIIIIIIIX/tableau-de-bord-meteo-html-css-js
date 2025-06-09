
        const API_KEY = 'INSÉREZ_VOTRE_CLÉ_API';
        const CITY = 'Paris';
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric&lang=fr`;

        document.addEventListener('DOMContentLoaded', () => {
            fetchWeatherData();
        });

        async function fetchWeatherData() {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                
                if(data.cod === '200') {
                    updateCurrentWeather(data.list[0]);
                    updateForecast(data.list);
                }
            } catch (error) {
                console.error('Erreur de récupération des données:', error);
            }
        }

        function updateCurrentWeather(data) {
            document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('wind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
            
            const iconCode = data.weather[0].icon;
            document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        }

        function updateForecast(forecastData) {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = '';
            
            // Filtrer pour un point par jour (12:00)
            const dailyData = forecastData.filter((item, index) => index % 8 === 0).slice(0, 5);
            
            dailyData.forEach((day, index) => {
                const date = new Date(day.dt * 1000);
                const dayElement = document.createElement('div');
                dayElement.className = 'forecast-day';
                dayElement.style.setProperty('--delay', index + 1);
                
                dayElement.innerHTML = `
                    <div class="forecast-date">${formatDate(date)}</div>
                    <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                    <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                `;
                
                forecastContainer.appendChild(dayElement);
            });
        }

        function formatDate(date) {
            return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        }