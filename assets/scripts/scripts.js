document.addEventListener("DOMContentLoaded", function () {
  // set default active section
  let activeSection = "notes";

  // Notes Elements
  const notesForm = document.getElementById("notes-form");
  const noteInput = document.getElementById("note-input");
  const notesList = document.getElementById("notes-list");

  // weather Elements
  const weatherForm = document.getElementById("weather-form");
  const cityInput = document.getElementById("city-input");
  const weatherResult = document.getElementById("weather-result");
  const WEATHER_API_KEY = "ce4c675fdf79035dc6c6caf5da9bc384";

  console.log("Weather DOM elements loaded:", {
    weatherForm,
    cityInput,
    weatherResult,
  });

  // News Elements
  const newsList = document.getElementById("news-list");
  const NEWS_API_KEY = "d967cc5f1ec58d7ec8107a22e7811a0c";
  console.log("News DOM elements loaded:", { newsList });

  /** Loads notes from localStorage and displays them */
  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notesList.innerHTML = "";

    notes.forEach((note) => {
      const li = document.createElement("li");
      li.className = "col-12 col-md-6"; // no animation on load
      li.innerHTML = `
      <div>
        <p><pre>${note.text}</pre></p>
      </div>
    `;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
      deleteBtn.dataset.id = note.id;
      li.querySelector("div").appendChild(deleteBtn);

      notesList.appendChild(li);
    });
  }
  loadNotes();

  /** Adds a single note element to the DOM with animation */
  function addNoteToDOM(note) {
    const li = document.createElement("li");
    li.className = "col-12 col-md-6 note-enter";
    li.innerHTML = `
    <div>
      <p><pre>${note.text}</pre></p>
    </div>
  `;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.dataset.id = note.id;
    li.querySelector("div").appendChild(deleteBtn);

    notesList.appendChild(li);

    li.offsetHeight;
    // Animation
    li.classList.add("note-enter-active");
    li.classList.remove("note-enter");
  }

  /** Handles note form submission */
  notesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = noteInput.value.trim();
    if (!text) return;

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const newNote = { id: Date.now(), text };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));

    // Add this note with animation
    addNoteToDOM(newNote);

    noteInput.value = "";
  });

  /** Deletes a note with exit animation */
  notesList.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));

    // Animation
    const li = btn.closest("li");
    if (li) {
      li.classList.add("note-exit");
      li.addEventListener("transitionend", () => li.remove());
    }
  });

  /** Fetches weather data from OpenWeather API */
  async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found! Example: Dublin, IE");
      }
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }

  /** Displays weather data in the DOM */
  function displayWeather(data) {
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const sunrise = formatTime(data.sys.sunrise);
    const sunset = formatTime(data.sys.sunset);

    const utcTimestamp = Date.now() + new Date().getTimezoneOffset() * 60000;
    const localTimestamp = utcTimestamp + data.timezone * 1000;
    const localTime = new Date(localTimestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    weatherResult.innerHTML = `
    <div class="weather-card p-3 border rounded text-center">
        <h3>${data.name}, ${data.sys.country}</h3>
        
        <!-- Weather temperature -->
        <div class="m-2 bg-body shadow-sm rounded d-flex flex-row align-items-center justify-content-between p-2">
            <div class="weather-main d-flex align-items-center justify-content-center">
                <img src="${iconUrl}" alt="${
      data.weather[0].description
    }" class="me-2" style="width:50px; height:50px;" />
                <span class="temp fs-3 fw-bold">${Math.round(
                  data.main.temp
                )}°C</span>
            </div>
            <div class="text-start">
                <p class="mb-1">Feels like: ${Math.round(
                  data.main.feels_like
                )}°C</p>
                <span class="badge bg-info text-dark">Min: ${Math.round(
                  data.main.temp_min
                )}°C / Max: ${Math.round(data.main.temp_max)}°C</span>
            </div>
        </div>

        <!-- Weather Details -->
        <div class="m-2 bg-body shadow-sm rounded d-flex flex-row justify-content-between p-2">
            <div class="d-flex flex-column align-items-start">
                <p class="description text-capitalize fs-6 fst-italic mb-2">${
                  data.weather[0].description
                }</p>
                <p class="mb-2"><i class="fa-solid fa-droplet"></i> Humidity: ${
                  data.main.humidity
                }%</p>
                <p class="mb-0"><i class="fa-regular fa-sun"></i> Sunrise: ${sunrise}</p>
            </div>
            <div class="d-flex flex-column align-items-start">
                <p class="mb-2"><i class="fa-solid fa-cloud"></i> Clouds: ${
                  data.clouds.all
                }%</p>
                <p class="mb-2"><i class="fa-solid fa-wind"></i> Wind: ${
                  data.wind.speed
                } m/s</p>
                <p class="mb-0"><i class="fa-regular fa-moon"></i> Sunset: ${sunset}</p>
            </div>
        </div>
    </div>

    <!-- More Weather Details -->
    <div class="weather-card p-3 border rounded text-center mt-3">

        <h4 class="mb-3">More Details</h4>

        <div class="m-2 bg-body shadow-sm rounded d-flex flex-row justify-content-between p-2">
            <div class="d-flex flex-column align-items-start">
                <p><i class="fa-solid fa-gauge"></i> Pressure: ${
                  data.main.pressure
                } hPa</p>
                <p><i class="fa-regular fa-eye"></i> Visibility: ${Math.round(
                  data.visibility / 1000
                )} km</p>
            </div>
            <div class="d-flex flex-column align-items-start">
                <p><i class="fa-regular fa-clock"></i> Local Time: ${localTime}</p>
                ${
                  data.rain && data.rain["1h"]
                    ? `<p><i class="fa-solid fa-cloud-rain"></i> Rain (1h): ${data.rain["1h"]} mm</p>`
                    : ""
                }
                ${
                  data.snow && data.snow["1h"]
                    ? `<p><i class="fa-regular fa-snowflake"></i> Snow (1h): ${data.snow["1h"]} mm</p>`
                    : ""
                }
                <p><i class="fa-solid fa-map-marker-alt"></i> Lat: ${
                  data.coord.lat
                }, Lon: ${data.coord.lon}</p>
            </div>
        </div>
    </div>
  `;

    // Change background based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case "clear":
        bgClass = "weather-clear";
        break;
      case "clouds":
        bgClass = "weather-clouds";
        break;
      case "rain":
        bgClass = "weather-rain";
        break;
      case "snow":
        bgClass = "weather-snow";
        break;
      case "thunderstorm":
        bgClass = "weather-thunderstorm";
        break;
      case "mist":
        bgClass = "weather-mist";
        break;
      case "fog":
        bgClass = "weather-fog";
        break;
      default:
        bgClass = "weather-clear";
        break;
    }

    weatherResult.querySelectorAll(".weather-card").forEach((card) => {
      card.classList.add(bgClass);
    });
  }

  /** Formats UNIX timestamp to HH:MM AM/PM */
  function formatTime(unixTime) {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  /** Handles weather form submission */
  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
      cityInput.value = "";
    }
    localStorage.setItem("city", city);
  });

  const savedCity = localStorage.getItem("city") || "Dublin, IE";
  fetchWeather(savedCity);

  /** Fetches news articles from the News API */
  async function fetchNews() {
    const url = `https://gnews.io/api/v4/top-headlines?country=ie&lang=en&max=5&apikey=${NEWS_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      displayNews(data.articles);
    } catch (error) {
      newsList.innerHTML = `<p class="error">Error loading news: ${error.message}</p>`;
    }
  }

  /** Displays news articles in the DOM */
  function displayNews(articles) {
    newsList.innerHTML = "";
    articles.forEach((article) => {
      const card = document.createElement("div");
      card.classList.add("news-card");
      card.innerHTML = `
                <div class="card mt-3 shadow-sm">
                    <img src="${article.image}" alt="${
        article.title
      }" class="card-img-top" />
                    <div class="card-body">
                        <h3 class="card-title"><a href="${
                          article.url
                        }" target="_blank">${article.title}</a></h3>
                        <p class="card-text">${
                          article.description || "No description available."
                        }</p>
                        <a href="${
                          article.url
                        }" target="_blank" class="btn btn-primary">Read more</a>
                    </div>
                </div>
                `;
      newsList.appendChild(card);
    });
  }
  fetchNews();

  /** Displays the selected section and hides others on small screens */
  function showSection(sectionId) {
    const sections = ["weather", "notes", "news"];
    activeSection = sectionId;

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (window.innerWidth < 992) {
        // Mobile view - only show the selected section
        if (id === sectionId) {
          el.classList.remove("d-none");
        } else {
          el.classList.add("d-none");
        }
      } else {
        // Desktop view - always show all sections
        el.classList.remove("d-none");
      }
    });

    // Close the offcanvas menu after selecting a section
    const offcanvasEl = document.getElementById("mobileMenu");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }
  window.showSection = showSection;

  // Keep layout correct on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth < 992) {
      showSection(activeSection);
    } else {
      // On desktop show all sections
      ["weather", "notes", "news"].forEach((id) => {
        document.getElementById(id)?.classList.remove("d-none");
      });
    }
  });

  // Initial display
  if (window.innerWidth < 992) {
    showSection(activeSection);
  } else {
    ["weather", "notes", "news"].forEach((id) => {
      document.getElementById(id)?.classList.remove("d-none");
    });
  }
});
