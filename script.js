const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemEl = document.getElementById("current-weather-item");
const timezone = document.getElementById("time-zone");
const cords = document.getElementById("cords");

const weatherForecastEl = document.getElementById("other-days-container");
const currentTempEl = document.getElementById("weather-today-container");

// TIME
const days = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "torsdag",
  "Fredag",
  "Lørdag",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minutes = time.getMinutes();

  const hoursIn12HourFormat = hour >= 13 ? hour % 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  const zeroFormat = minutes >= 10 ? minutes : `0${minutes}`;

  timeEl.innerHTML = `${hoursIn12HourFormat}:${zeroFormat} <span id="am-pm">${ampm}</span>`;

  `${days[day]}, ${date} ${month}`;
  dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

// GEO
getGeoLocation();
function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(success => {
    let { latitude, longitude } = success.coords;

    getWeatherData(latitude, longitude);
  });
}

// FETCH
let errorCountAmountOfTryies = 0;

async function getWeatherData(latitude, longitude) {
  // &units=metric
  const unit = "metric";
  const API_KEY = "00c7513850cbcd35ec15ad086b344353";
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&units=${unit}&appid=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    showWeatherData(data);
  } catch (error) {
    // RETRY FETCH
    if (errorCountAmountOfTryies < 3) {
      getWeatherData();
      //   console.log(errorCountAmountOfTryies);
      errorCountAmountOfTryies++;
    }
    console.log("whoops, something went wrong!", error);
  }
}

// RENDER
function showWeatherData(data) {
  // hoisting error
  //   let data;
  let { humidity, pressure, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  cords.innerHTML = `${data.lat}N ${data.lon}E`;

  currentWeatherItemEl.innerHTML = `
  <div id="current-weather-item">
    <span>Fugtighed</span>
    <span>${humidity}%</span>
  </div>
  <div id="current-weather-item">
    <span>Tryk</span>
    <span>${pressure}</span>
  </div>
  <div id="current-weather-item">
    <span>Vindhastighed</span>
    <span>${wind_speed}</span>
  </div>`;
  // unix timestamp => format with cdn moment.js
  // https://cdnjs.com/libraries/moment.js

  let otherDayEl = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `

        
      <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img
            class="w-icon"
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="weather-icon"
          />
          <div class="col">
         
          <div class="temp">Night - ${day.temp.night}&#176; C</div>
          <div class="temp">Day - ${day.temp.day}&#176; C</div>
        </div>
        `;
    } else {
      otherDayEl += `
      
      <div class="weather-forecast-item">
      <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
      <img
      class="w-icon"
      src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
      alt="weather-icon"
    />
        <div class="temp">Night - ${day.temp.night}&#176; C</div>
        <div class="temp">Day - ${day.temp.day}&#176; C</div>
      </div>

      
       
        `;
    }
  });

  weatherForecastEl.innerHTML = otherDayEl;
}
