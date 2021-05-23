//date

let nowtime = new Date();
let date = nowtime.getDate();
let months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
let month = months[nowtime.getMonth()];

let hours = nowtime.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = nowtime.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let currentdate = document.querySelector("#currentdate");
let currentmonth = document.querySelector("#currentmonth");
let currenttime = document.querySelector("#currenttime");

currentdate.innerHTML = `${date}`;
currentmonth.innerHTML = `${month}`;
currenttime.innerHTML = `${hours}:${minutes}`;

// format forecastdays to words

function formatday(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = date.getDay();

  return days[day];
}

// display forecast and replicate future days

function displayforecast(response) {
  let forecast = response.data.daily;
  let forecastelement = document.querySelector("#forecast");
  let forecastHTML = `<div class="">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="row align-items-center text-center mt-3 futuredays T+1">
      <div class="col icon">
      <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          class="forecasticon"
          width=""
      />
      </div>
      <div class="col futuredate">${formatday(forecastDay.dt)}</div>
      <div class="col tempmax"><span id="forecasttempmax">${Math.round(
        forecastDay.temp.max
      )}</span>°</div>
      <div class="col tempmin"><span id="forecasttempmin">${Math.round(
        forecastDay.temp.min
      )}</span>°</div>
      <div class="col futurestats">
        <div class="row T+1 humidity">
          <i class="fas fa-temperature-high humidityicon"></i>
          <span class="humidityvalue"> ${forecastDay.humidity}% </span>
        </div>
        <div class="row T+1 rainfall">
          <i class="fas fa-tint"></i>
          <span class="rainfallvalue"> ${Math.round(
            forecastDay.pop * 100
          )}% </span>
        </div>
      </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastelement.innerHTML = forecastHTML;

  console.log(forecast);

  // currentday forecast for rainfall

  let currentdayrainforecast = document.querySelector("#currentrainfall");
  currentdayrainforecast.innerHTML = `${forecast[0].pop * 100}%`;
}

// API for forecast days from coords in currentdayAPI data

function getforecast(coordinates) {
  console.log(coordinates);

  let apikey = `404ebbfe1292f8e13a6dd9e110c25a01`;
  let units = `metric`;
  let apiurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apikey}&units=${units}`;

  axios.get(apiurl).then(displayforecast);
}

// searched country API weather

function showtemp(response) {
  let currenttemp = document.querySelector("#currenttemp");
  let formatdisplaysearchcountry = document.querySelector(
    "#displaysearchcountry"
  );
  let currenthumidity = document.querySelector("#currenthumidity");
  let humidityvalue = response.data.main.humidity;
  let iconElement = document.querySelector("#todayicon");

  celsiustempdata = response.data.main.temp;

  currenttemp.innerHTML = Math.round(celsiustempdata);
  formatdisplaysearchcountry.innerHTML = response.data.name;
  currenthumidity.innerHTML = `${humidityvalue}%`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  console.log(response.data);

  getforecast(response.data.coord);
}

function searchcity(city) {
  let apikey = `404ebbfe1292f8e13a6dd9e110c25a01`;
  let apiendpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let units = `metric`;
  let apiurl = `${apiendpoint}q=${city}&appid=${apikey}&units=${units}`;

  axios.get(apiurl).then(showtemp);
}

function searchcountrybutton(event) {
  event.preventDefault();
  let city = document.querySelector("#searchcountryinput").value;
  searchcity(city);
}

let searchcountryinput = document.querySelector("#searchcountrybar");
searchcountryinput.addEventListener("submit", searchcountrybutton);

// geolocation API weather

function showposition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apikey = `404ebbfe1292f8e13a6dd9e110c25a01`;
  let units = `metric`;
  let apiurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=${units}`;
  axios.get(apiurl).then(showtemp);
  console.log(lat);
  console.log(lon);
}

function getposition() {
  navigator.geolocation.getCurrentPosition(showposition);
}

let getlocation = document.querySelector("#locationbutton");
getlocation.addEventListener("click", getposition);

// fave cities display

function displayfavetemp(response) {
  let favedata = response.data;
  let faveElement = document.querySelector("#faveblock");

  favecelsiustemp = response.data.main.temp;

  faveHTML = `<div class="col-3 text-center">
              <p class="fave1cityname" id="fave1city">${favedata.name}</p>
              <div class="fave1">
                <img 
                src="http://openweathermap.org/img/wn/${
                  favedata.weather[0].icon
                }@2x.png" 
                alt="" 
                class="fave1icon" 
                id="fave1icon" width="" />
                <span class="fave1temp" id="favecitytemp">${Math.round(
                  favedata.main.temp
                )}</span>°
              </div>
    </div>`;
  faveElement.innerHTML += faveHTML;

  console.log(favedata);
  console.log(favedata.main.temp);
}

// search fave city API

function favecity() {
  let faveElement = document.querySelector("#faveblock");
  faveElement.innerHTML = null;

  let favecities = ["London", "Seoul", "New York"];
  favecities.forEach(function (favecity) {
    let apikey = `404ebbfe1292f8e13a6dd9e110c25a01`;
    let apiendpoint = `https://api.openweathermap.org/data/2.5/weather?`;
    let units = `metric`;
    let apiurl = `${apiendpoint}q=${favecity}&appid=${apikey}&units=${units}`;

    axios.get(apiurl).then(displayfavetemp);
  });
}

// run fave city on load

favecity();

// changing of weather metrics link

function changeFahrenheit(event) {
  event.preventDefault();
  let currenttemp = document.querySelector("#currenttemp");
  linkCelsius.classList.remove("active");
  linkFahrenheit.classList.add("active");
  let fahrenheittempdata = (celsiustempdata * 9) / 5 + 32;
  currenttemp.innerHTML = Math.round(fahrenheittempdata);

  let forecastmax = document.querySelectorAll("#forecasttempmax");
  forecastmax.forEach(function (item) {
    let currentTempvalue = item.innerHTML;
    item.innerHTML = Math.round((currentTempvalue * 9) / 5 + 32);
  });

  let forecastmin = document.querySelectorAll("#forecasttempmin");
  forecastmin.forEach(function (item) {
    let currentTempvalue = item.innerHTML;
    item.innerHTML = Math.round((currentTempvalue * 9) / 5 + 32);
  });

  let favecitytemp = document.querySelectorAll("#favecitytemp");
  favecitytemp.forEach(function (favedata) {
    let favefahrenheittemp = (favedata.innerHTML * 9) / 5 + 32;
    favedata.innerHTML = Math.round(favefahrenheittemp);
  });

  console.log(favecitytemp);

  linkCelsius.addEventListener("click", changeCelsius);
  linkFahrenheit.removeEventListener("click", changeFahrenheit);
}

function changeCelsius(event) {
  event.preventDefault();
  let currenttemp = document.querySelector("#currenttemp");
  linkFahrenheit.classList.remove("active");
  linkCelsius.classList.add("active");
  currenttemp.innerHTML = Math.round(celsiustempdata);

  let forecastmax = document.querySelectorAll("#forecasttempmax");
  forecastmax.forEach(function (item) {
    let currentTempvalue = item.innerHTML;
    item.innerHTML = Math.round(((currentTempvalue - 32) * 5) / 9);
  });

  let forecastmin = document.querySelectorAll("#forecasttempmin");
  forecastmin.forEach(function (item) {
    let currentTempvalue = item.innerHTML;
    item.innerHTML = Math.round(((currentTempvalue - 32) * 5) / 9);
  });

  let favecitytemp = document.querySelectorAll("#favecitytemp");
  favecitytemp.forEach(function (favedata) {
    let favecelsiustemp = favedata.innerHTML;
    favedata.innerHTML = Math.round(favecelsiustemp);
  });

  linkFahrenheit.addEventListener("click", changeFahrenheit);
  linkCelsius.removeEventListener("click", changeCelsius);
}

let celsiustempdata = null;

let favecelsiustemp = null;

let linkFahrenheit = document.querySelector("#linkFahrenheit");
linkFahrenheit.addEventListener("click", changeFahrenheit);
let linkCelsius = document.querySelector("#linkCelsius");
linkCelsius.addEventListener("click", changeCelsius);

// City on load

searchcity("Seoul");
