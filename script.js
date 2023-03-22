function getInfo(yourUrl){
    var json_obj = JSON.parse(Get(yourUrl));
    console.log(json_obj);
    temp_c = json_obj.current.temp_c;
    console.log(temp_c+" degrees C");
    feelslike_c = json_obj.current.feelslike_c;
    console.log("feels like "+feelslike_c+" degrees C");
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
    showMap();
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function showInfo(yourUrl){
    getInfo(yourUrl);

    document.querySelector('#temp').innerHTML = temp_c;
    document.querySelector('#feelsLike').innerHTML = feelslike_c;
    document.querySelector('#wind').innerHTML = wind_ms;
    document.querySelector('#city').innerHTML = city;
    document.querySelector('#country').innerHTML = country;
    document.querySelector('#gusts').innerHTML = gusts;
    document.querySelector('#humidity').innerHTML = humidity;
    document.querySelector('#pressure').innerHTML = pressure;
}


function getSearch(){
    let city = document.getElementById("searchbar").value;
    console.log(city);
    let href = `http://api.weatherapi.com/v1/current.json?key=318aa1ee4ae245f18db141657230903&q=${city}&aqi=no`;
    console.log(href);   
    showInfo(href);
}



function test(){
    var input = document.getElementById("searchbar");
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getSearch();
    }
    });
}

function showMap(){
    let mapSrc = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${long}&width=650&height=450&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`
    const frame = document.querySelector('#frame');
    frame.innerHTML = `
    <iframe src='${mapSrc}' frameborder="0"></iframe>
`;
}