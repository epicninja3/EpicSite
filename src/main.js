import './style.css'

function screenClose (element){
    element.style.display = "none";

}
function screenOpen(element){
  element.style.display = "flex";
//   element.classList.remove('fade');

}

// ----------
// Time
// ----------
function updateTime(){
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
  });
  const time = now.toLocaleString("en-US",{
    hour: "numeric",
    minute: "2-digit"

  });
    // var currentTime = new Date().toLocaleString();
    // var timeText = document.querySelector("#timeElement");
    // timeText.innerHTML = currentTime
  document.querySelector("#timeElement").innerHTML = `${time}`
  document.querySelector("#date").innerHTML = `${date}`
}
updateTime();
setInterval(updateTime, 1000);


// ------------------------
// Bookmark logic and stuff
// ------------------------

const bookmarkMaker = document.querySelector("#bookmarkMaker");
const bookmarkCreate = document.querySelector("#createBook");
const urlInput = document.querySelector("#urlinput"); 
const nameInput = document.querySelector("#nameInput");
const submitBk = document.querySelector("#addmark");
const bookmarksContainer = document.querySelector("#bookmarks"); // Targets your buttons div
const cancelBook = document.querySelector("#cancelmark");
const createContainer = document.querySelector("#createContainer");

// const logoUrl = `https://google.com{urlInput}&sz=64`;
// const imgHtml = `<img src="${logoUrl}"/>`;



//making array
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
// let bookmarks = [];
// localStorage.removeItem("bookmarks");

bookmarkCreate.addEventListener('click', function(){
  screenOpen(bookmarkMaker);
});
cancelBook.addEventListener('click', function(){
  screenClose(bookmarkMaker);
});

//dynamically add the new bookmarks
function showBookmarks() {

  const oldLinks = bookmarksContainer.querySelectorAll('.dynamic-bookmark');
  oldLinks.forEach(link => link.remove());

  
  bookmarks.forEach((item, index) => {
    
    const newButton = document.createElement('a');
    newButton.href = item.url;
    newButton.target = "_blank";
    // newButton.textContent = item.name;
    const text = document.createElement("span");
    text.textContent = item.name;
    text.style.fontFamily = "Elms Sans";
    text.style.fontSize = "20px";
    const deleteBtn = document.createElement('button');
    
    deleteBtn.classList.add('deleteBtn');
    const deleteimg = document.createElement('img');
    deleteimg.src = "assets/red-trash-can-icon.png";

    // deleteimg

    deleteBtn.appendChild(deleteimg);


    newButton.classList.add('dynamic-bookmark'); 
    const img = document.createElement("img");

    img.classList.add('bookimg');
    const domain = new URL(item.url).hostname;

    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    // const text = document.createElement("span");
    // text.textContent = item.name;

    deleteBtn.addEventListener('click', function(e){
      e.preventDefault(); // doesnt open bookmark
      e.stopPropagation();
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      showBookmarks();
    })
    newButton.append(deleteBtn);
    newButton.append(img);
    newButton.append(text);
    // newButton.append(deleteBtn);
    bookmarksContainer.insertBefore(newButton, createContainer);
  });
}


submitBk.addEventListener('click', function(e){
 
  if (!nameInput.value || !urlInput.value){
    return alert("Please fill both fields!");
  }
  let urla = urlInput.value.trim();

  if (!urla.startsWith("http://") && !urla.startsWith("https://")) {
    urla = "https://" + urla;
  }
  const newBook = {
    name: nameInput.value,
    url: urla
  };

  bookmarks.push(newBook); 
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); 
  // console.log(localStorage.getItem("bookmarks"));


  showBookmarks(); 
  screenClose(bookmarkMaker); 
  
  
  nameInput.value = "";
  urlInput.value = "";
});


showBookmarks();

// ------------
// APOD Stuff,
// ------------
const apodDisplay = document.getElementById("apoddisplay");
const apodTitle = document.getElementById("apodtitle");
const apodinfo = document.getElementById("info");
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
      const apodurl = data.url;
      apodDisplay.style.backgroundImage = `url(${apodurl})`;
      apodinfo.innerHTML = data.explanation;
      apodTitle.innerHTML = data.title;
  })
  .catch(error => {
    console.error(error);
  });


// ----------
// Timer stuff
// ----------
const hour = document.getElementById("hour");
const min = document.getElementById("min");
const sec = document.getElementById("sec");
const start = document.getElementById("start");
const reset = document.getElementById("reset");


let countdown;
let totalSeconds = 0;
let timeLeft = 0;

function startTime(){
  let h = parseInt(hour.value) || 0;
  let m = parseInt(min.value) || 0;
  let s = parseInt(sec.value) || 0;


  totalSeconds = (h * 3600) + (m * 60) + (s)

  //this basically converts everything back into correct time format so 100sec becomes 1 min 40 sec
  h = Math.floor(totalSeconds / 3600);
  m = Math.floor((totalSeconds % 3600) / 60);
  s = totalSeconds % 60;

 
  hour.value = h;
  min.value = m;
  sec.value = s;
  timeLeft = totalSeconds;
  
  if (totalSeconds == 0){
    bar.style.width = "0%";
    alert("Please enter a value in at least on of the input fields!");
    console.log("Please enter a value.");
    
    return;
  }
  else if (totalSeconds > 0){
    clearInterval(countdown)
    countdown = setInterval(() =>{
      
      s--;
      timeLeft--;
      var percent = (timeLeft / totalSeconds) * 100;
      bar.style.width = percent + "%";
      if (percent == 0){
        bar.style.width = "0%";
        
      };
      // sec - 1;
      if (s < 0){
        m--;
        s = 59;
        // min -1
      };
      if (m < 0){
        h--;
        m = 59;
        // hour - 1
      };
      hour.value = h;
      min.value = m;
      sec.value = s;

      if (h === 0 && m === 0 && s === 0){
        clearInterval(countdown);
        console.log("done");
      };

    }, 1000);
  };
};


start.addEventListener('click', function(){
  bar.style.width = "100%";
  
  startTime();
});
reset.addEventListener('click', function(){
  clearInterval(countdown);
  hour.value = 0;
  min.value = 0;
  sec.value = 0;
  bar.style.width = "0%";

});

// -------------
// Weather Stuff
// -------------

async function getWeather(){
    navigator.geolocation.getCurrentPosition(success, error);

    async function success(position) {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Build weather URL
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${lat}` +
            `&longitude=${lon}` +
            `&current=temperature_2m,wind_speed_10m,is_day,wind_direction_10m,precipitation,rain,showers,snowfall,cloud_cover,weather_code` +
            `&temperature_unit=fahrenheit` +
            `&wind_speed_unit=mph` +
            `&timezone=auto` +
            `&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code` +
            `&models=ecmwf_ifs`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        const sunrise = weatherData.daily.sunrise[0].split("T")[1];
        const sunset = weatherData.daily.sunset[0].split("T")[1];
        const temperature = weatherData.current.temperature_2m;
        const windspeed = weatherData.current.wind_speed_10m;
        const high = weatherData.daily.temperature_2m_max[0];
        const low = weatherData.daily.temperature_2m_min[0];
        const winddirect = weatherData.current.wind_direction_10m;
        const perceptprob = weatherData.daily.precipitation_probability_max[0];
        const perceptprobtmr = weatherData.daily.precipitation_probability_max[1];
        const rainsum = weatherData.daily.precipitation_sum[0];
        let day ="";
        let dayhigh = 0;
        const codeb = weatherData.current.weather_code;
        const iconb = weatherIcon(codeb);
        const localTime = new Date().toLocaleTimeString("en-US", {
          timeZone: weatherData.timezone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });
        
    function weatherIcon(code, isDay){
      switch(code){
        case 0:
          return isDay
          ? "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/clear-day.svg"
          : "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/clear-night.svg";
        case 1:
        case 2:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/mostly-clear-day.svg";
        case 3:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/overcast.svg";
        case 45:
        case 48:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/fog.svg";
        case 51:
        case 53:
        case 55:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/drizzle.svg";
        case 56:
        case 57:
        case 66:
        case 67:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/sleet.svg";
        case 61:
        case 63:
        case 65:
        case 80:
        case 81:
        case 82:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/rain.svg";
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/snow.svg";
        case 95:
        case 96:
        case 99:
          return "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/thunderstorms-overcast-rain.svg";
        default:
          return "..."

      }
    }




    
          console.log(`Temperature: ${weatherData.current.temperature_2m}°F`);
          console.log(`Wind: ${weatherData.current.wind_speed_10m} mph`);
          console.log(`Daytime: ${weatherData.current.is_day ? "Yes" : "No"}`);
          console.log(`Local Time: ${localTime}`);
        

          // console.log(`Sunrise: ${sunrise.split("T")[1]}`);
          // console.log(`Sunset: ${sunset.split("T")[1]}`);
          document.getElementById("sunrise").innerHTML = `🌅Sunrise: <strong>${sunrise}`;
          document.getElementById("sunset").innerHTML = `🌇Sunset: <strong>${sunset}`;
          
          document.getElementById("currentIcon").src = iconb;

          document.getElementById("currenttemp").innerHTML = `<strong>${temperature}°F`;
          
          document.getElementById("maxtemp").innerHTML = `High: ${high}°F`;
          document.getElementById("mintemp").innerHTML = `Low : ${low}°F`;
          
          document.getElementById("perceptprob").innerHTML = `🌧️Chance of Rain: <strong>${perceptprob}%`;
          
          document.getElementById("rainsum").innerHTML = `Total Precipitation: <strong>${rainsum}mm`;
        
          
        } catch (error) {
            console.error(error);
        }
    }
    


  function error() {
        alert("Location permission denied.");
    }
}

getWeather();

// document.getElementById("searchBtn").addEventListener("click", function(){
//     const city = document.getElementById("cityInput").value.trim();

//     if (city) {
//         getWeather(city);
//     }
// });
