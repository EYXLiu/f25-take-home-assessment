from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
from dotenv import load_dotenv
import os
import requests
import uuid
import redis
import json

app = FastAPI(title="Weather Data System", version="1.0.0")
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for weather data
weather_storage = redis.Redis(host='redis', port=6379, db=0)

weather_api = os.getenv("WEATHER_API_KEY")

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str

@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    """
    You need to implement this endpoint to handle the following:
    1. Receive form data (date, location, notes)
    2. Calls WeatherStack API for the location
    3. Stores combined data with unique ID in memory
    4. Returns the ID to frontend
    """
    location = request.location
    url = f'http://api.weatherstack.com/current?access_key={weather_api}&query={location}'
    try:
        
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        
        print(data)
        
        if 'error' in data:
            raise HTTPException(status_code=400, detail=data['error']['info'])
        
        data['date'] = request.date
        data['location'] = request.location
        if request.notes:
            data['notes'] = request.notes
        
        print("complete")
        
        dict_id = str(uuid.uuid4())
        weather_storage.setex(dict_id, 7200, json.dumps(data))
        
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Weather API request timed out.")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=502, detail="Connection error to Weather API.")
    except requests.exceptions.HTTPError as err:
        raise HTTPException(status_code=500, detail=f"HTTP error: {err}")
    except Exception:
        raise HTTPException(status_code=500, detail="Unexpected error occurred.")

    return {"id": str(dict_id)}

@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if not weather_storage.exists(weather_id):
        raise HTTPException(status_code=404, detail="Weather data not found")
    
    return json.loads(weather_storage.get(weather_id).decode())

@app.get("/weather")
async def get_weather_keys():
    cursor = 0
    keys = []
    while True:
        cursor, batch = weather_storage.scan(cursor=cursor)
        for b in batch:
            v = weather_storage.get(b)
            if v:
                keys.append({"key": b.decode(), "location": json.loads(v).get("location")})
        if cursor == 0:
            break
    return keys

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)