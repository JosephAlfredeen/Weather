// Definerar variabler på startvärden
var overlay = 'wind';
var corf = 'c';

// Script för att hämta användarens cordinater.
function getLocation(){
    navigator.geolocation.getCurrentPosition(successCallback,errorCallBack)
}

// Script för att omvandla cordinaterna till namnet på en stad.
function successCallback(pos) {
    const crd = pos.coords;

    var json_city = JSON.parse(Get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${crd.latitude}&longitude=${crd.longitude }&localityLanguage=en`));
    var userCity = json_city.city;

    // Sätter href till användarens stad
    href = `https://api.weatherapi.com/v1/current.json?key=318aa1ee4ae245f18db141657230903&q=${userCity}&aqi=no`; 
    showInfo(href, false);
}
// Tar bort rutan för informationen om användarens stad om användaren inte godkänner till att få åtkomst till dens plats information.
function errorCallBack(){
    document.getElementById('your-location-container').style.display = 'none';
    alert('Could not retrieve users location');
}

// Hämtar all väder information om platsen användaren behöver
function getInfo(yourUrl){
    var json_obj = JSON.parse(Get(yourUrl));
    temp_c = json_obj.current.temp_c;
    temp_f = json_obj.current.temp_f;
    feelslike_c = json_obj.current.feelslike_c;
    feelslike_f = json_obj.current.feelslike_f;
    wind_ms = Math.round(json_obj.current.wind_kph/3.6);
    country = json_obj.location.country;
    city = json_obj.location.name;
    rain = json_obj.current.precip_mm;
    gusts = Math.round(json_obj.current.gust_kph/3.6);
    humidity = json_obj.current.humidity;
    pressure = json_obj.current.pressure_mb;
    lat = json_obj.location.lat;
    long = json_obj.location.lon;
    timestamp = json_obj.current.last_updated;
    text = json_obj.current.condition.text;
    icon = json_obj.current.condition.icon;
    showMap();
}

// Hämtar ut infon från url jag skapat
function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

// Funktion för att updatera informationen på sidan. 
// Kollar ifall det är "search" rutan som ska uppdateras eller inte.
// Scrollar sedan till rutan som uppdaterats
function showInfo(href, search){
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

// Lägger till det man skrivit i sökrutan i en variabel, som sedan läggs till i url.
function getSearch(){
    let city = document.getElementById("searchbar").value;
    href = `https://api.weatherapi.com/v1/current.json?key=318aa1ee4ae245f18db141657230903&q=${city}&aqi=no`
    showInfo(href, true);
}

// Ifall man trycker på enter körs funktionen för att updatera url
function search(){
    var input = document.getElementById("searchbar");
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getSearch();
    }   
    });
}

// Visar laddar ikonen
// Updaterar rubriken över iframen efter vad det är som visas
// Updaterar även vilket område som visas i iframe
function showMap(){
    var loading = document.getElementById('loadingContainer');
    var container = document.getElementById('frameContainer');
    loading.style.display = 'flex';
    container.style.display = 'none';
    displayOverlay = overlay.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    document.getElementById('frameHead').innerHTML = displayOverlay;
    let mapSrc = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${long}&width=650&height=450&zoom=5&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`
    const frame = document.querySelector('#frame');
    frame.innerHTML = `
    <iframe id='iframe' src='${mapSrc}' frameborder="0" onload='loadIframe()'></iframe>
`;
}

// Visar eller gömmer dropdown menyn
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

// Ändrar från celsius till fahrenheit och tvärtom
function changec_f() {
    if (corf == 'c'){
        document.getElementById('c_f').innerHTML = 'F°';
        corf = 'f';
    }
    else{
        document.getElementById('c_f').innerHTML = 'C°';
        corf = 'c';
    }
    // Kör funktionerna för att uppdatera infon efter vad det ändrats till
    showInfo(href, true);
    showInfo(href, false);
}

// Ändrar ifall iframen visar temperaturen eller vindhastigheten
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

// Visar laddnings ikonen innan den visar iframen
function loadIframe(){
    var loading = document.getElementById('loadingContainer')
    var container = document.getElementById('frameContainer')
    setTimeout(function() {
        loading.style.display = 'none';
        container.style.display = 'flex';
    ; }, 1500);
}