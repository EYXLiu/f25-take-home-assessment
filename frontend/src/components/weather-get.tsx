
export async function WeatherGet() {
    let d: Record<string, string> = {};
    const response = await fetch(`http://0.0.0.0:8000/weather`);
        if (response.ok) {
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                d[data[i]["location"]] = data[i]["key"]
            }
        } else {
            return {};
        }
    return d;
}