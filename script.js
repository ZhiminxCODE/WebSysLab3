// === CONFIG ===
const OWM_API_KEY = "bfdd760f6bbade3892a08264c5ceef73"; // your key
const TROY        = { name: "Troy, NY", lat: 42.7284, lon: -73.6918 };
const UNITS       = "imperial"; // °F

let lastWeatherMain = ""; // e.g., "Rain", "Clear"

// === WEATHER ===
async function getWeather(lat, lon) {
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({ lat, lon, appid: OWM_API_KEY, units: UNITS }).toString();
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather HTTP " + res.status);
  return res.json();
}

function renderWeather(w) {
  const mainObj = (w.weather && w.weather[0]) ? w.weather[0] : { main: "-", description: "-" };
  lastWeatherMain = mainObj.main || "";
  const temp = Math.round(w.main.temp);
  const html = `
    <ul>
      <li><strong>City:</strong> ${w.name || TROY.name}</li>
      <li><strong>Condition:</strong> ${mainObj.main} — ${mainObj.description}</li>
      <li><strong>Temperature:</strong> ${temp}°F</li>
      <li><strong>Humidity:</strong> ${w.main.humidity}%</li>
      <li><strong>Wind:</strong> ${Math.round(w.wind.speed)} mph</li>
      <li><strong>Clouds:</strong> ${w.clouds?.all ?? 0}%</li>
    </ul>`;
  document.getElementById("weatherOut").innerHTML = html;
}

// === Weather → comfort keywords ===
function weatherToComfortQueries(main = "") {
  const m = (main || "").toLowerCase();
  if (m.includes("thunder")) return ["stew", "curry", "noodle", "ramen"];
  if (m.includes("drizzle")) return ["ramen", "noodle", "soup", "udon"];
  if (m.includes("rain"))    return ["soup", "ramen", "curry", "stew", "noodle"];
  if (m.includes("snow"))    return ["chili", "stew", "casserole", "hot chocolate", "pie"];
  if (m.includes("cloud"))   return ["pasta", "lasagna", "risotto", "casserole"];
  if (m.includes("clear"))   return ["salad", "bbq", "grill", "wrap"];
  return ["quick", "pasta", "sandwich"]; // default
}

// === TheMealDB helpers ===
async function getMealsByQuery(query) {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/search.php");
  url.search = new URLSearchParams({ s: query }).toString();
  const res  = await fetch(url);
  if (!res.ok) throw new Error("MealDB HTTP " + res.status);
  const data = await res.json();
  const meals = data.meals || [];
  return meals.map(m => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
    area: m.strArea,
    category: m.strCategory,
    url: `https://www.themealdb.com/meal/${m.idMeal}`
  }));
}

async function getMealsByCategory(category) {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/filter.php");
  url.search = new URLSearchParams({ c: category }).toString();
  const res  = await fetch(url);
  if (!res.ok) throw new Error("MealDB HTTP " + res.status);
  const data = await res.json();
  const list = data.meals || [];
  return list.map(m => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
    url: `https://www.themealdb.com/meal/${m.idMeal}`
  }));
}

async function getRandomMeals(n = 4) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    if (!res.ok) break;
    const data = await res.json();
    const m = (data.meals || [])[0];
    if (m) out.push({
      id: m.idMeal, title: m.strMeal, image: m.strMealThumb,
      url: `https://www.themealdb.com/meal/${m.idMeal}`
    });
  }
  return out;
}

// === utils ===
function uniqueById(arr) {
    const seen = new Set();
    return arr.filter(x => x && x.id && (seen.has(x.id) ? false : (seen.add(x.id), true)));
  }
  
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
function sample(arr, n) { return shuffle(arr.slice()).slice(0, n); }

function renderIdeas(list) {
  const out = document.getElementById("ideasOut");
  if (!list.length) { out.innerHTML = '<div class="err">No ideas found.</div>'; return; }
  const items = list.map(x => `
    <li>
      ${x.image ? `<img class="thumb" src="${x.image}" alt="thumb">` : `<div class="thumb" style="background:#eee;"></div>`}
      <div class="text">
        <a href="${x.url}" target="_blank" rel="noreferrer">${x.title}</a>
        ${x.category || x.area ? `<div class="meta">— ${x.category || ""}${x.area ? ` • ${x.area}` : ""}</div>` : ""}
      </div>
    </li>
  `).join("");
  out.innerHTML = `<ul>${items}</ul>`;
}

// === main (weather-only): merge queries until enough items ===
const MIN_RESULTS = 8;

async function loadIdeasBasedOnWeather() {
  const weatherQs = weatherToComfortQueries(lastWeatherMain);
  document.getElementById("ideasSeed").textContent = `Seeds: ${weatherQs.join(", ")}`;

  let merged = [];

  try {
    // 1) Add multiple weather queries
    for (const q of weatherQs) {
      const r = await getMealsByQuery(q);
      merged = uniqueById(merged.concat(r));
      if (merged.length >= MIN_RESULTS) break;
    }

    // 2) Category fallback (broad list) — pick enough to fill
    if (merged.length < MIN_RESULTS) {
      const lw = (lastWeatherMain || "").toLowerCase();
      const cat = lw.includes("clear") ? "Side"
               : lw.includes("snow")  ? "Beef"
               : lw.includes("rain")  ? "Starter"
               : "Miscellaneous";
      const r = await getMealsByCategory(cat);
      merged = uniqueById(merged.concat(sample(r, MIN_RESULTS - merged.length)));
    }

    // 3) Random rescue
    if (merged.length < MIN_RESULTS) {
      const r = await getRandomMeals(MIN_RESULTS - merged.length);
      merged = uniqueById(merged.concat(r));
    }

    renderIdeas(shuffle(merged).slice(0, MIN_RESULTS));
  } catch (e) {
    document.getElementById("ideasOut").innerHTML = `<div class="err">${e.message}</div>`;
  }
}

// === Events ===
document.addEventListener("DOMContentLoaded", () => {
  // Load Troy weather
  document.getElementById("loadWeatherBtn").addEventListener("click", async () => {
    const s = document.getElementById("weatherStatus");
    try {
      s.textContent = "Loading weather...";
      const w = await getWeather(TROY.lat, TROY.lon);
      renderWeather(w);
      s.textContent = "Loaded ✓";
      s.className   = "small ok";
      await loadIdeasBasedOnWeather();
    } catch (e) {
      s.textContent = e.message;
      s.className   = "small err";
    }
  });

  // Pretend weather
  document.getElementById("applyPretendBtn").addEventListener("click", async () => {
    const fake = document.getElementById("pretendWeather").value;
    if (fake) {
      lastWeatherMain = fake;
      const s = document.getElementById("weatherStatus");
      s.textContent = `Testing: Pretend ${fake} ✓`;
      s.className   = "small ok";
    }
    await loadIdeasBasedOnWeather();
  });

  // Manual ideas button
  document.getElementById("loadIdeasBtn").addEventListener("click", loadIdeasBasedOnWeather);

  // Auto-load once
  (async function init() {
    try {
      const w = await getWeather(TROY.lat, TROY.lon);
      renderWeather(w);
      const s = document.getElementById("weatherStatus");
      s.textContent = "Loaded ✓";
      s.className   = "small ok";
    } catch {}
    await loadIdeasBasedOnWeather();
  })();
});
