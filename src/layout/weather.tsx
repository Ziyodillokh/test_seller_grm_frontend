import { useEffect } from "react";

import { useWaetherStore } from "@/store/weather-store";

export default function Weather() {
  const { weather, setWeather } = useWaetherStore();
  const fetchWeather = async () => {
    try {
      if (!weather || weather.expirationTime < Date.now()) {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${
            "2722cca9280348888f7220344250304"
          }&q=Tashkent&aqi=no`
        );
        const weatherData = await response.json();
        const expirationTime = Date.now() + 8 * 60 * 60 * 1000;

        setWeather({ ...weatherData, expirationTime });
      } else {
        return null;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);
  
  return (
    <div className="flex items-start gap-1">
      <img width={24} src={weather?.current?.condition?.icon} />
      <h3 className="text-[26px] font-light relative text-primary leading-[120%]">
        {weather?.current?.temp_c?.toFixed(0) || 0}
        <p className="font-normal absolute -top-3 -right-3 text-[10px]">° C</p>
      </h3>
    </div>
  );
}
