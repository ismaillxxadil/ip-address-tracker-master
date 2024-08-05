import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [isp, setIsp] = useState("");
  const [lat, setLat] = useState(51.505);
  const [lng, setLng] = useState(-0.09);

  useEffect(() => {
    async function fetchIp() {
      try {
        const response = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_swTLtihYMgc4AWS3F14oBld52Vf4q&ipAddress=${search}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setLocation(data.location.country);
        setTimeZone(data.location.timezone);
        setIsp(data.isp);
        setLat(data.location.lat);
        setLng(data.location.lng);
      } catch (error) {
        console.error("Error fetching the IP data:", error);
        if (error.message.includes("HTTP error! status: 403")) {
          console.error(
            "Access restricted. Check credits balance or enter the correct API key."
          );
        }
      }
    }

    fetchIp();
  }, [search]);

  useEffect(() => {
    const map = L.map("map").setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    marker
      .bindPopup(`<b>IP Location</b><br>Lat: ${lat}, Lng: ${lng}`)
      .openPopup();

    return () => {
      map.remove(); // Clean up the map instance on component unmount or effect re-run
    };
  }, [lat, lng]);

  return (
    <div className="container">
      <TopSide search={search} setSearch={setSearch} />
      <Box location={location} timeZone={timeZone} isp={isp} search={search} />
      <div id="map"></div>
    </div>
  );
}

function TopSide({ search, setSearch }) {
  return (
    <div className="info-container">
      <h3>IP Address Tracer</h3>
      <input
        type="text"
        placeholder="Search for any IP address or domain"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function Box({ location, timeZone, isp, search }) {
  return (
    <div className="address-information">
      <p>
        IP Address <br /> <strong>{search}</strong>
      </p>
      <hr />
      <p className="text">
        Location <br /> <strong>{location}</strong>
      </p>
      <hr />
      <p className="text">
        TimeZone <br /> <strong>UTC{timeZone}</strong>
      </p>
      <hr />
      <p className="text">
        ISP <br /> <strong>{isp}</strong>
      </p>
    </div>
  );
}

export default App;
