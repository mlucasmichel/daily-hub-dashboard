document.addEventListener("DOMContentLoaded", function () {
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
      li.textContent = note.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.dataset.id = note.id;
      li.appendChild(deleteBtn);

      notesList.appendChild(li);
    });
  }
  loadNotes();

  /** Adds a new note */
  notesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = noteInput.value.trim();
    if (!text) return;

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({ id: Date.now(), text });
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
    noteInput.value = "";
  });

  /** Deletes a note */
  notesList.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const id = Number(event.target.dataset.id);
      let notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes = notes.filter((note) => note.id !== id);
      localStorage.setItem("notes", JSON.stringify(notes));
      loadNotes();
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
    weatherResult.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>${data.main.temp} °C</p>
        <p>${data.weather[0].description}</p>
      `;
  }

  /** Handles weather form submission */
  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
      cityInput.value = "";
    }
  });

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
                <img src="${article.image}" alt="${article.title}" />
                <h3><a href="${article.url}" target="_blank">${
        article.title
      }</a></h3>
                <p>${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank">Read more</a>
                `;
      newsList.appendChild(card);
    });
  }
  fetchNews();

  /** Displays the selected section and hides others on small screens */
  function showSection(sectionId) {
    const sections = ["weather", "notes", "news"];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        // display the selected section and hide others on small screens
      if (sectionId === "all") {
        el.style.display = "block";
      } else if (window.innerWidth < 992) {
          el.style.display = id === sectionId ? "block" : "none";
        } else {
          // always show all sections on large screens
          el.style.display = "block";
        }
      }
    });

    // close the offcanvas menu after selecting a section
    const offcanvasEl = document.getElementById("mobileMenu");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }
  window.showSection = showSection;

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      showSection("all");
    } else {
      showSection("notes");
    }
  });

  // show default section on load
  if (window.innerWidth < 992) {
    showSection("notes");
  } else {
    ['weather', 'notes', 'news'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "block";
    });
  }
});
