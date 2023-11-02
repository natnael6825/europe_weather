document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://www.7timer.info/bin/api.pl";
    const cityDropdown = document.getElementById("city");
    const forecastContainer = document.querySelector(".forecast");

    // Fetch the city data
    fetch("city_coordinates.csv")
        .then((response) => response.text())
        .then((data) => {
            const lines = data.split("\n");
            const cities = [];

            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(",");
                if (parts.length === 4) {
                    const city = parts[2];
                    const latitude = parts[0];
                    const longitude = parts[1];
                    cities.push({ city, latitude, longitude });
                }
            }

            cities.forEach((cityData) => {
                const option = document.createElement("option");
                option.value = cityData.city;
                option.textContent = cityData.city;
                option.dataset.latitude = cityData.latitude;
                option.dataset.longitude = cityData.longitude;
                cityDropdown.appendChild(option);
            });
        });

    document.getElementById("get-weather").addEventListener("click", function () {
        const selectedOption = cityDropdown.options[cityDropdown.selectedIndex];
        const selectedCity = selectedOption.value;
        const selectedLatitude = selectedOption.dataset.latitude;
        const selectedLongitude = selectedOption.dataset.longitude;

        const params = new URLSearchParams({
            lon: selectedLongitude,
            lat: selectedLatitude,
            product: "civil",
            output: "json",
        });

        // Update the API URL with the selected city's coordinates
        const apiUrlWithCoords = `${apiUrl}?${params.toString()}`;

        // Fetch weather data and display the forecast
        fetch(apiUrlWithCoords)
            .then((response) => response.json())
            .then((data) => {
                const forecastData = data.dataseries;

                // Clear previous forecast if any
                forecastContainer.innerHTML = "";

                // Display the weather forecast for the next 7 days
                const currentDate = new Date();
                for (let i = 0; i < 7; i++) {
                    const dayForecast = forecastData[i];
                    const day = i + 1;

                    const forecastItem = document.createElement("div");
                    forecastItem.classList.add("forecast-item");

                    // Set the date for the next day
                    currentDate.setDate(currentDate.getDate() + 1);
                    const options = { weekday: "long", month: "long", day: "numeric" };
                    const formattedDate = currentDate.toLocaleDateString("en-US", options);

                    const dayHeader = document.createElement("h3");
                    dayHeader.textContent = `Day ${day} - ${formattedDate}`;

                    // Set the weather icon based on the weather type
                    const weatherIcon = dayForecast.weather.replace(/(day|night)/, "");
                    const weatherImage = document.createElement("img");
                
                    weatherImage.src = `images/${weatherIcon}.png`;
                    weatherImage.alt = weatherIcon;

                    // Create a list for weather details
                    const detailsList = document.createElement("ul");
                    detailsList.classList.add("details-list");

                    // Add temperature
                    const temperatureItem = document.createElement("li");
                    temperatureItem.textContent = `Temperature: ${dayForecast.temp2m}°C`;

                    // Add cloud cover
                    const cloudCoverItem = document.createElement("li");
                    cloudCoverItem.textContent = `Cloud Cover: ${dayForecast.cloudcover}`;

                    // Add wind
                    const windItem = document.createElement("li");
                    windItem.textContent = `Wind: ${dayForecast.wind10m.direction}, ${dayForecast.wind10m.speed} m/s`;

                    // Add precipitation
                  

                    // Append details to the list
                    detailsList.appendChild(temperatureItem);
                 
                    detailsList.appendChild(windItem);
                 

                    forecastItem.appendChild(dayHeader);
                    forecastItem.appendChild(weatherImage);
                    forecastItem.appendChild(detailsList);

                    forecastContainer.appendChild(forecastItem);
                }
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    });
});
