var overlay = 'wind';
var corf = 'c';

// Script för att hämta användarens cordinater.
function getLocation(){
    navigator.geolocation.getCurrentPosition(successCallback,errorCallBack)
}

// Script för att omvandla cordinaterna till namnet på en stad.
function successCallback(pos) {
    const crd = pos.coords;

    console.log('Latitude : '+crd.latitude);
    console.log('Longitude: '+crd.longitude);

    var json_city = JSON.parse(Get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${crd.latitude}&longitude=${crd.longitude }&localityLanguage=en`));
    console.log(json_city);
    var userCity = json_city.city;
    console.log(userCity);
    href = `https://api.weatherapi.com/v1/current.json?key=318aa1ee4ae245f18db141657230903&q=${userCity}&aqi=no`; 
    showInfo(href, false);
}
// Tar bort rutan för informationen om användarens stad om användaren inte godkänner till att få åtkomst till dens plats information.
function errorCallBack(){
    document.getElementById('your-location-container').style.display = 'none';
    alert('Could not retrieve users location');
}

// Script to add all weather information to variables.
function getInfo(yourUrl){
    var json_obj = JSON.parse(Get(yourUrl));
    console.log(json_obj);
    temp_c = json_obj.current.temp_c;
    console.log(temp_c+" degrees celsius");
    temp_f = json_obj.current.temp_f;
    console.log(temp_f+" degrees fahrenheit")
    feelslike_c = json_obj.current.feelslike_c;
    console.log("feels like "+feelslike_c+" degrees celsius");
    feelslike_f = json_obj.current.feelslike_f;
    console.log("feels like "+feelslike_f+" degrees fahrenheit")
    wind_ms = Math.round(json_obj.current.wind_kph/3.6);
    console.log("wind= "+wind_ms+" m/s");
    country = json_obj.location.country
    console.log("country is "+country)
    city = json_obj.location.name
    console.log("city is "+city)
    rain = json_obj.current.precip_mm
    console.log('rain = '+rain+' mm')
    gusts = Math.round(json_obj.current.gust_kph/3.6)
    console.log('Gusts = '+gusts+' m/s')
    humidity = json_obj.current.humidity
    console.log('humidity = '+humidity+"%")
    pressure = json_obj.current.pressure_mb
    console.log('pressure = '+pressure+(' mb'))
    lat = json_obj.location.lat
    console.log('lat is '+lat)
    long = json_obj.location.lon
    console.log('long is '+long)
    timestamp = json_obj.current.last_updated;
    console.log(timestamp);
    text = json_obj.current.condition.text;
    console.log('text = '+ text)
    icon = json_obj.current.condition.icon;
    console.log('icon = '+ icon)
    showMap();
}

// Script to get something
function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

// Script update weather information on index.html
function showInfo(href, search){
    console.log('corf = '+corf);
    getInfo(href);
    if (search == true){
        document.querySelector('#searched-container').style.display = 'block'
        if (corf == 'c'){
            document.querySelector('#search-temp').innerHTML = temp_c+' °C';
            document.querySelector('#search-feelsLike').innerHTML = feelslike_c+' °C';
        }
        else{
            document.querySelector('#search-temp').innerHTML = temp_f+' °F';
            document.querySelector('#search-feelsLike').innerHTML = feelslike_f+' °F';
        }
        document.querySelector('#search-wind').innerHTML = wind_ms;
        document.querySelector('#search-city').innerHTML = city;
        document.querySelector('#search-country').innerHTML = country;
        document.querySelector('#search-gusts').innerHTML = gusts;
        document.querySelector('#search-humidity').innerHTML = humidity;
        document.querySelector('#search-pressure').innerHTML = pressure;
        document.querySelector('#search-rain').innerHTML = rain;
        document.querySelector('#search-timestamp').innerHTML = timestamp; 
        document.querySelector('#search-text').innerHTML = text;
        document.querySelector('#search-condition-icon').src = icon;
        var location = document.querySelector('#searched-container');
        location.scrollIntoView({ behavior:'smooth'});
    }
    else if(search == false){
        if (corf == 'c'){
            document.querySelector('#temp').innerHTML = temp_c+' °C';
            document.querySelector('#feelsLike').innerHTML = feelslike_c+' °C';
        }
        else{
            document.querySelector('#temp').innerHTML = temp_f+' °F';
            document.querySelector('#feelsLike').innerHTML = feelslike_f+' °F';
        }
        document.querySelector('#wind').innerHTML = wind_ms;
        document.querySelector('#city').innerHTML = city;
        document.querySelector('#country').innerHTML = country;
        document.querySelector('#gusts').innerHTML = gusts;
        document.querySelector('#humidity').innerHTML = humidity;
        document.querySelector('#pressure').innerHTML = pressure;
        document.querySelector('#rain').innerHTML = rain;
        document.querySelector('#timestamp').innerHTML = timestamp;
        document.querySelector('#text').innerHTML = text;
        document.querySelector('#condition-icon').src = icon;
        var location = document.querySelector('#your-location-container');
        location.scrollIntoView({ behavior:'smooth'});
    }
}

// Script to get new href
function getSearch(){
    console.log('get search began')
    let city = document.getElementById("searchbar").value;
    console.log(city);
    href = `https://api.weatherapi.com/v1/current.json?key=318aa1ee4ae245f18db141657230903&q=${city}&aqi=no`
    console.log('href = ' + href);
    showInfo(href, true);
}

// Script to add search input to variable on key press enter
function search(){
    var input = document.getElementById("searchbar");
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getSearch();
    }   
    });
}

// Script to load a new iframe
function showMap(){
    var loading = document.getElementById('loadingContainer');
    var container = document.getElementById('frameContainer');
    loading.style.display = 'flex';
    container.style.display = 'none';
    displayOverlay = overlay.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    console.log(displayOverlay)
    document.getElementById('frameHead').innerHTML = displayOverlay;
    let mapSrc = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${long}&width=650&height=450&zoom=5&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`
    const frame = document.querySelector('#frame');
    frame.innerHTML = `
    <iframe id='iframe' src='${mapSrc}' frameborder="0" onload='loadIframe()'></iframe>
`;
}

// Script to show drop down menu
function showDropdown() {
    setTimeout(() => {
        var node = document.getElementById('dropdown');
        if (node.style.visibility=='visible') {
            node.style.visibility = 'hidden';
        }
        else
            node.style.visibility = 'visible'
    }, 250);
}
// Script to change between celius and fahrenheit
function changec_f() {
    if (corf == 'c'){
        document.getElementById('c_f').innerHTML = 'F°';
        corf = 'f';
        console.log('change c to f')
    }
    else{
        document.getElementById('c_f').innerHTML = 'C°';
        corf = 'c';
        console.log('change f to c')
    }
    showInfo(href, true);
    showInfo(href, false);
}

// Script to change if iframe shows temp or wind speeds
function changeFrame(){
    if (overlay== 'wind') {
        document.getElementById('tempButton').innerHTML = 'Show '+ overlay;
    }
    else
        document.getElementById('tempButton').innerHTML = 'Show '+ overlay;
    if (overlay== 'wind') {
        overlay = 'temp'
    }
    else
        overlay = 'wind'
    showMap();
}

//Script show loading animation before iframe
function loadIframe(){
    var loading = document.getElementById('loadingContainer')
    var container = document.getElementById('frameContainer')
    setTimeout(function() {
        loading.style.display = 'none';
        container.style.display = 'flex';
    ; }, 1500);
}



// Non functioning script to find when iframe is loded
/*
function checkIframeLoaded() {
    console.log('check iframe')
    // Get a handle to the iframe element
    var iframe = document.getElementById('iframe');
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Check if loading is complete
    if (  iframeDoc.readyState  == 'complete' ) {
        //iframe.contentWindow.alert("Hello");
        iframe.contentWindow.onload = function(){
            alert("I am loaded");
        };
        // The loading is complete, call the function we want executed once the iframe is loaded
        afterLoading();
        return;
    } 

    // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
    window.setTimeout(checkIframeLoaded, 100);
}

function afterLoading(){
    alert("I am here");
}
*/