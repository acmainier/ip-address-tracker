async function getIPData() {
  const response = await fetch(
    "https://geo.ipify.org/api/v2/country,city?apiKey=at_uW8gPDGUPRheumcYB6riwvKlijvEY",
  );
  const data = await response.json();
  console.log(data);

  document.getElementById("ipaddress").textContent = data.ip;
  document.getElementById("location").textContent =
    `${data.location.city}, ${data.location.region}, ${data.location.postalCode}`;
  document.getElementById("timezone").textContent = data.location.timezone;
  document.getElementById("isp").textContent = data.isp;
}

getIPData();
