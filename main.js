const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const statusMessage = document.getElementById('status-message');
const weatherCard = document.getElementById('weather-card');

// Elementos HTML que serão atualizados dinamicamente
const cityName = document.getElementById('city-name');
const weatherDesc = document.getElementById('weather-desc');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// Evento disparado quando o usuário envia o formulário de busca
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  
  if (!city) return;

  showStatus('Buscando dados da cidade...', 'loading');

  try {
    const data = await fetchWeatherData(city);
    renderWeather(data);
    
    // Salva a última cidade pesquisada no navegador
    localStorage.setItem('lastCity', city);
    hideStatus();
  } catch (error) {
    showStatus(error.message, 'error');
    weatherCard.classList.add('hidden');
  }
});

// Função assíncrona usando a wttr.in (formato JSON sem precisar de chave)

async function fetchWeatherData(city) {

  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Não foi possível encontrar a cidade.');
  }

  const data = await response.json();
  
  // A wttr.in retorna um JSON próprio, vamos tratá-lo para o nosso layout
  const current = data.current_condition[0];
  const area = data.nearest_area[0];

  return {
    name: area.areaName[0].value,
    country: area.country[0].value,
    temp: current.temp_C,
    feelsLike: current.FeelsLikeC,
    humidity: current.humidity,
    windSpeed: current.windspeedKmph,
    pressure: current.pressure,
    description: current.lang_pt ? current.lang_pt[0].value : current.weatherDesc[0].value
  };
}

// Função responsável por preencher os dados na tela
function renderWeather(data) {
  cityName.textContent = `${data.name}, ${data.country}`;
  weatherDesc.textContent = data.description;
  temperature.textContent = `${data.temp}°C`;
  feelsLike.textContent = `${data.feelsLike}°C`;
  humidity.textContent = `${data.humidity}%`;
  windSpeed.textContent = `${data.windSpeed} km/h`;
  pressure.textContent = `${data.pressure} hPa`;

  weatherCard.classList.remove('hidden');
}


// Funções auxiliares de status
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.classList.remove('hidden', 'bg-red-500/20', 'text-red-300', 'bg-sky-500/20', 'text-sky-300');

  if (type === 'error') {
    statusMessage.classList.add('bg-red-500/20', 'text-red-300', 'border', 'border-red-500/30');
  } else {
    statusMessage.classList.add('bg-sky-500/20', 'text-sky-300', 'border', 'border-sky-500/30');
  }
}

function hideStatus() {
  statusMessage.classList.add('hidden');
}

// Carrega automaticamente a última cidade ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    cityInput.value = lastCity;
    form.requestSubmit();
  }
});