"use state";
import React, { useEffect, useState } from "react";

type WeatherFormatProps = {
    id: string;
  };

export function WeatherFormat({ id }: WeatherFormatProps) {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
        try {
            const response = await fetch(`http://0.0.0.0:8000/weather/${id}`);
            if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }
        fetchWeather();
    }, [id]);

    if (loading) return <div>Loading weather data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return null;

    const {
        location,
        current,
        date,
    } = data;
  
    return (
        <div>
            <div><strong>Weather for:</strong> {location}</div>
            <div><strong>Date:</strong> {date}</div>

            <div>
                <div>{current.weather_descriptions[0]}</div>
                <div>{current.temperature}°C (Feels like {current.feelslike}°C)</div>
            </div>

            <div>
                <div><strong>Observation Time:</strong> {current.observation_time}</div>
                <div><strong>Wind:</strong> {current.wind_speed} km/h {current.wind_dir}</div>
            </div>

            <div><strong>Humidity:</strong> {current.humidity}%</div>
            <div><strong>Pressure:</strong> {current.pressure} mb</div>
            <div><strong>Visibility:</strong> {current.visibility} km</div>

            <div>
                <strong>Astronomical Info:</strong>
                <div>Sunrise: {current.astro.sunrise} | Sunset: {current.astro.sunset}</div>
                <div>Moonrise: {current.astro.moonrise} | Moonset: {current.astro.moonset}</div>
                <div>Moon phase: {current.astro.moon_phase} ({current.astro.moon_illumination}%)</div>
            </div>

            <div>
                <strong>Air Quality:</strong>
                <div>CO: {current.air_quality.co}</div>
                <div>NO₂: {current.air_quality.no2}</div>
                <div>O₃: {current.air_quality.o3}</div>
                <div>SO₂: {current.air_quality.so2}</div>
                <div>PM2.5: {current.air_quality.pm2_5}</div>
                <div>PM10: {current.air_quality.pm10}</div>
                <div>US EPA Index: {current.air_quality["us-epa-index"]}</div>
                <div>GB DEFRA Index: {current.air_quality["gb-defra-index"]}</div>
            </div>
        </div>
    )
}