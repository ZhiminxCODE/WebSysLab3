# 🌤️ Info

This is a tiny front-end app (**HTML/CSS/JS**) that shows the current weather for **Troy, NY** using **OpenWeatherMap** and then suggests cozy recipe ideas from **TheMealDB** that fit the weather vibe.  

The weather condition (e.g., *Rain*, *Clear*, *Snow*) maps to a few “comfort” keywords like *soup*, *ramen*, *stew*, or *salad*. The app queries **TheMealDB** with several keywords, merges and de-duplicates results, and if there still aren’t enough items, falls back to a broad category and finally a couple of random meals.  

There’s also a **“Pretend Weather” tester** so you can preview rainy/snowy suggestions instantly.

---

# 🧱 Work Log

- Started by wiring **OpenWeatherMap** (lat/lon for Troy, `units=imperial`) and rendering the basic weather fields.  
- Initially tried a **music recommendation** approach with **Last.fm**, mapping weather → mood and fetching tracks via `tag.getTopTracks` for compound tags like “k-pop rainy.”  
  - Result: too sparse/inconsistent, so pivoted.  
- Switched to **TheMealDB** (no key required):
  - Implemented multiple weather-driven keywords  
  - Added **category & random fallbacks**, plus **de-duplication** and a **Fisher–Yates shuffle**  
- Fixed layout issue where long recipe titles were cut off by switching to a **two-column CSS grid**.  
- Final cleanup focused on:
  - Clear `fetch` calls with `async/await`
  - Use of `URLSearchParams`
  - Minimal, clean UI

---

# 💡 What I Learned

- Practiced reading **API docs** and translating parameters into working requests  
- Handled **uneven data** by chaining queries and creating fallback logic  
- Debugged **front-end issues** like array merging, shuffle bugs, and text wrapping  
- Learned to keep a simple stack (HTML/CSS/JS) to make the **data flow and Fetch API** behavior transparent

---

# 🔗 Sources

- **OpenWeatherMap – Current Weather API**  
  https://openweathermap.org/current  
- **TheMealDB API (test key “1”)**  
  https://www.themealdb.com/api.php  
  - Search: https://www.themealdb.com/api/json/v1/1/search.php?s=  
  - Filter: https://www.themealdb.com/api/json/v1/1/filter.php?c=  
  - Random: https://www.themealdb.com/api/json/v1/1/random.php  
- **Last.fm API (attempted earlier)**  
  https://www.last.fm/api  
  - Method: `tag.getTopTracks`: https://www.last.fm/api/show/tag.getTopTracks  
- **MDN Docs**
  - [Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)  
  - [URL](https://developer.mozilla.org/docs/Web/API/URL)  
  - [URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams)  
  - [async functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)  
  - [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)  
- **VS Code Live Server**  
  https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer  
- **Tutorial References**
  - [Traversy Media – Weather App](https://www.youtube.com/watch?v=VCd4cgAvC2Y)  
  - [Net Ninja – Async JS / Fetch (playlist)](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gKfw25slm4CUDUcM_sXdml)
