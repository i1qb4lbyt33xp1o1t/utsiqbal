import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  if (!city) {
    return new Response(JSON.stringify({ error: 'Please specify a city' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`
    );
    const weatherData = response.data;
    return new Response(JSON.stringify({
      city: weatherData.name,
      temp: weatherData.main.temp,
      desc: weatherData.weather[0].description,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch weather data. Check your API Key or city name.',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}