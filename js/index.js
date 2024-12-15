//=============== Global ======================
const searchInputElement = document.querySelector(".search-input");
const loadingElement = document.querySelector(".loading");

const apiKey = "591edd0e8db94b79ad8205053241212";
let creteria = "forecast";
let userLocation=0;

let apiURL;
//=============== Events ======================
searchInputElement.addEventListener("input",function(){
    formApiURL("search");
});

document.querySelector(".search-form").addEventListener("submit",function(e){
    e.preventDefault();
});
//=============== Functions ===================

window.onload = async function ()  {
    await getUserLocation();
  }


  async function getUserLocation() {

    if (!navigator.geolocation) {
      alert( "Geolocation is not supported by your browser.");
      userLocation = 0;
      return;
    }

    await navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
      console.log(position.coords.longitude);
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      userLocation =   `${latitude},${longitude}` ;
      console.log(userLocation);
      //get data using user location
      formApiURL("userLocation",latitude,longitude);
    //   getDataApi(latitude,longitude);
    }

    function error() {
      let x = "Unable to retrieve your location.";
      userLocation = 0;
      console.log(userLocation);
    }
}



async function getDataApi(){
    try{
        showLoading();
        let response = await fetch(apiURL);
        let final = await response.json();
        console.log(final.current);
        displayData(final);
    }catch (error){
        console.log("There is an error, "+error);
    }
    

}

function displayData (result){

    const cards = document.querySelectorAll(".card");
    cards.forEach(function(card, index){
        const placeElement = card.querySelector(".place");
        placeElement.innerHTML = `${result.location.name}, ${result.location.country}`;

        const conditionTextElement = card.querySelector(".condition-text");
        const weatherspecsElements = card.querySelectorAll(".weather-specs span");
        const weatherImgElement = card.querySelector(".weather-img img");
        const tempElement = card.querySelector(".temp");

        const dayElement = card.querySelector(".day");
        const dateElement = card.querySelector(".date");

        let dayDate ;

        let condition ;
        
        //current card weather
        if(index == 0){
            
            tempElement.innerHTML = result.current.temp_c;
            conditionTextElement.innerHTML = result.current.condition.text;
            weatherImgElement.src = result.current.condition.icon;
            console.log(result.current.temp_c);

            weatherspecsElements[0].innerHTML = `${result.current.humidity}%`
            weatherspecsElements[1].innerHTML = `${result.current.wind_kph}km/h`
            weatherspecsElements[2].innerHTML = `${result.current.uv}`
            weatherspecsElements[3].innerHTML = `${result.current.wind_dir}`

            dayDate = new Date(result.current.last_updated);
           

            condition = result.current.condition.text;

        }

        // the next forecast 
        else{
            const tempElement = card.querySelector(".temp");
            tempElement.innerHTML = result.forecast.forecastday[index].day.maxtemp_c;

            const minTempElement = card.querySelector(".temp-min");
            minTempElement.innerHTML = result.forecast.forecastday[index].day.mintemp_c;

            conditionTextElement.innerHTML = result.forecast.forecastday[index].day.condition.text;
            weatherImgElement.src = result.forecast.forecastday[index].day.condition.icon
            console.log(result.forecast.forecastday[index].day.condition.icon);
            
            console.log(result.current.temp_c);

            weatherspecsElements[0].innerHTML = `${result.forecast.forecastday[index].day.avghumidity}%`
            weatherspecsElements[1].innerHTML = `${result.forecast.forecastday[index].day.maxwind_kph}km/h`
            weatherspecsElements[2].innerHTML = `${result.forecast.forecastday[index].day.uv}`
            weatherspecsElements[3].innerHTML = `${result.forecast.forecastday[index].hour[0].wind_dir}`
        

            dayDate = new Date(result.forecast.forecastday[index].date);


            condition = result.current.condition.text;
        }

        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const formattedDate = dayDate.toLocaleDateString('en-US', options);
        dayElement.innerHTML = formattedDate.split(",")[0];
        dateElement.innerHTML = formattedDate.split(", ")[1];

        hideLoading();
    });

}


function formApiURL(urlType, lat, long){
    if(urlType === "search"){
        let searchValue = searchInputElement.value;
        if(searchValue !== ""){
            apiURL =`https://api.weatherapi.com/v1/${creteria}.json?key=${apiKey}&q=${searchValue}&days=3`
        }
        else {
            getUserLocation();
        }

    }
    else if(urlType === "userLocation"){
        apiURL = `https://api.weatherapi.com/v1/${creteria}.json?key=${apiKey}&q=${lat},${long}&days=3`;
    }

    getDataApi();

}


function showLoading(){
    loadingElement.classList.replace("d-none","d-flex");
}

function hideLoading(){
    loadingElement.classList.replace("d-flex","d-none");
}
//=============== Validations =================


