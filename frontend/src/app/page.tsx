"use client";

import { WeatherForm } from "@/components/weather-form";
import { WeatherGet } from "@/components/weather-get";
import { WeatherFormat } from "@/components/weather-format";
import { useState, useEffect } from "react";


export default function Home() {
  const [ids, setIds] = useState<Record<string, string>>({});

  useEffect(() => {
    WeatherGet().then(data => setIds(data));
  }, []); 
  const [selectedId, setSelectedId] = useState<string>("");
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Weather System
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit weather requests and retrieve stored results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Weather Form Section */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-2xl font-semibold mb-4">
              Submit Weather Request
            </h2>
            <WeatherForm 
              onResultId={(id, location) => {
                setIds((prev) => ({...prev, [location]: id})); 
              }}
            />
          </div>

          {/* Data Lookup Section Placeholder */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-2xl font-semibold mb-4">Lookup Weather Data</h2>
            {Object.keys(ids).length == 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">
                  Submit a Weather Data Request 
                </h3>
              </div>
            </div>) : (
              <div className="flex flex-col items-center justify-start">
                <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border pt-6 pb-3 px-3 shadow-sm">
                  <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="border p-2 rounded w-48 mx-auto b-4">
                    <option value="" disabled>
                      -- Select an ID --
                    </option>
                    {Object.keys(ids).map((location) => (
                      <option key={location} value={ids[location]}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {selectedId && <WeatherFormat id={selectedId}/>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
