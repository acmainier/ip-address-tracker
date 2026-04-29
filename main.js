let map;
let marker;
const customIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const form = document.getElementById("form");
const input = document.getElementById("input");

async function getIPData() {
  let ipifyURL;

  if (input.value === "") {
    ipifyURL =
      "https://geo.ipify.org/api/v2/country,city?apiKey=at_uW8gPDGUPRheumcYB6riwvKlijvEY";
  } else {
    const isIP = /^[\d.]+$/.test(input.value);
    const param = isIP ? `ipAddress=${input.value}` : `domain=${input.value}`;
    ipifyURL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_uW8gPDGUPRheumcYB6riwvKlijvEY&${param}`;
  }
  const response = await fetch(ipifyURL);
  const data = await response.json();

  document.getElementById("ipaddress").textContent = data.ip;
  document.getElementById("location").textContent =
    `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
  document.getElementById("timezone").textContent = data.location.timezone;
  document.getElementById("isp").textContent = data.isp;

  if (!map) {
    map = L.map("map").setView([data.location.lat, data.location.lng], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    marker = L.marker([data.location.lat, data.location.lng], {
      icon: customIcon,
    }).addTo(map);
  } else {
    map.setView([data.location.lat, data.location.lng], 13);
    marker.setLatLng([data.location.lat, data.location.lng]);
  }
}

getIPData();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getIPData();
});
