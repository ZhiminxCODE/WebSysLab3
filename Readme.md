Info
This is a tiny front-end app (HTML/CSS/JS) that shows the current weather for Troy, NY using OpenWeatherMap and then suggests cozy recipe ideas from TheMealDB that fit the weather vibe. The weather condition (e.g., Rain, Clear, Snow) maps to a few “comfort” keywords like soup, ramen, stew, or salad. The app queries TheMealDB with several keywords, merges and de-duplicates results, and if there still aren’t enough items, falls back to a broad category and finally a couple of random meals. There’s also a “Pretend Weather” tester so you can preview rainy/snowy suggestions instantly.

Work LOG
I started by wiring OpenWeatherMap (lat/lon for Troy, units=imperial) and rendering the basic weather fields. I then tried a music recommendation approach with Last.fm: the idea was to map weather → mood and fetch tracks via tag.getTopTracks for compound tags like “k-pop rainy.” In practice, those niche tag combos were often sparse or empty, which made the experience inconsistent. I pivoted to TheMealDB (no key required), implemented multiple weather-driven keywords, and added category & random fallbacks, plus de-duplication and a proper Fisher–Yates shuffle. A layout issue made long recipe titles look cut off; switching each recipe row to a two-column CSS grid fixed the wrapping. Final cleanup focused on clear fetch calls with async/await, URLSearchParams, and a minimal UI.

What I Learned
I practiced reading API docs and turning parameters into working requests, handling uneven data by chaining queries and fallbacks, and debugging small front-end issues (array merging, shuffle bugs, and text wrapping). Keeping the stack to plain HTML/CSS/JS made the data flow and browser APIs (Fetch, URLSearchParams) very clear.

Sources
OpenWeatherMap – Current Weather API: https://openweathermap.org/current
TheMealDB API (test key “1”): https://www.themealdb.com/api.php
Search: https://www.themealdb.com/api/json/v1/1/search.php?s=
Filter: https://www.themealdb.com/api/json/v1/1/filter.php?c=
Random: https://www.themealdb.com/api/json/v1/1/random.php
Last.fm API (attempted earlier): https://www.last.fm/api
Method: tag.getTopTracks: https://www.last.fm/api/show/tag.getTopTracks
MDN – Fetch API: https://developer.mozilla.org/docs/Web/API/Fetch_API
MDN – URL: https://developer.mozilla.org/docs/Web/API/URL
MDN – URLSearchParams: https://developer.mozilla.org/docs/Web/API/URLSearchParams
MDN – async functions: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function
MDN – Promises: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
VS Code Live Server: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
Traversy Media – Weather App (comparison): https://www.youtube.com/watch?v=VCd4cgAvC2Y
Net Ninja – Async JS / Fetch (playlist): https://www.youtube.com/playlist?list=PL4cUxeGkcC9gKfw25slm4CUDUcM_sXdml