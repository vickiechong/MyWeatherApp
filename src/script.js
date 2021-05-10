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

// changing of weather metrics link

function changeFahrenheit(event) {
  event.preventDefault();
  let currenttemp = document.querySelector("#currenttemp");
  linkCelsius.classList.remove("active");
  linkFahrenheit.classList.add("active");
  let fahrenheittempdata = (celsiustempdata * 9) / 5 + 32;
  currenttemp.innerHTML = Math.round(fahrenheittempdata);
}

function changeCelsius(event) {
  event.preventDefault();
  let currenttemp = document.querySelector("#currenttemp");
  linkFahrenheit.classList.remove("active");
  linkCelsius.classList.add("active");
  currenttemp.innerHTML = Math.round(celsiustempdata);
}

let celsiustempdata = null;

let linkFahrenheit = document.querySelector("#linkFahrenheit");
linkFahrenheit.addEventListener("click", changeFahrenheit);
let linkCelsius = document.querySelector("#linkCelsius");
linkCelsius.addEventListener("click", changeCelsius);

// City on load

searchcity("Seoul");
