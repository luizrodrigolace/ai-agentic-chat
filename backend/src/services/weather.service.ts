import axios from 'axios';

export async function getWeather(city: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  return `${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
}
