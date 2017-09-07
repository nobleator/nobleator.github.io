/*function checkWeather() {
    var ip_xhr = new XMLHttpRequest();
    ip_xhr.open('GET', 'http://freegeoip.net/json/', false);
    ip_xhr.send();
    console.log(ip_xhr.status);
    console.log(ip_xhr.statusText);
    var ip_resp = JSON.parse(ip_xhr.responseText)
    var lat = ip_resp.lat
    var lon = ip_resp.lon

    var wth_xhr = new XMLHttpRequest();
    wth_xhr.open('GET', 'http://openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon, false);
    wth_xhr.send();
    console.log(wth_xhr.status);
    console.log(wth_xhr.statusText);
    var wth_resp = JSON.parse(wth_xhr.responseText)
}
window.onload=checkWeather();*/

function toggleWeather() {
    var hDiv = document.getElementById('hero');
    var bgDivs = hDiv.getElementsByTagName('div');
    for (i = 0; i < bgDivs.length; i++) {
        if (bgDivs[i].classList.length > 0) {
            bgDivs[i].classList.remove('visible');
            if (i == bgDivs.length - 1){
                bgDivs[0].classList.add('visible');
            } else {
                bgDivs[i + 1].classList.add('visible');
            }
            break;
        }
    }
}