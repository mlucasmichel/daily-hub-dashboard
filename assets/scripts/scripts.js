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
  const newsContainer = document.getElementById("news-list");

  console.log("News DOM elements loaded:", { newsContainer });

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
        throw new Error("City not found");
      }
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }
});
