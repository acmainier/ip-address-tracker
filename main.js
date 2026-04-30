let map;
let marker;
const customIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const error = document.getElementById("error");
const ipAddress = document.getElementById("ipaddress");
const locationElement = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");

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
  try {
    error.textContent = "";
    const response = await fetch(ipifyURL);
    if (response.status === 422) {
      throw new Error(
        "Invalid format. Please enter a valid IP address or domain name.",
      );
    }
    if (!response.ok) {
      throw new Error(
        "The service is currently unavailable. Please try again later.",
      );
    }
    const data = await response.json();
    const coords = [data.location.lat, data.location.lng];

    ipAddress.textContent = data.ip;
    locationElement.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezone.textContent = data.location.timezone;
    isp.textContent = data.isp;

    if (!map) {
      map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      marker = L.marker(coords, {
        icon: customIcon,
      }).addTo(map);
    } else {
      map.setView(coords, 13);
      marker.setLatLng(coords);
    }
  } catch (err) {
    error.textContent = err.message;
  }
}

getIPData();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getIPData();
});
