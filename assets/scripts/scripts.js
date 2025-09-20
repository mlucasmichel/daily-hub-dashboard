document.addEventListener("DOMContentLoaded", function () {
  const notesForm = document.getElementById("notes-form");
  const noteInput = document.getElementById("note-input");
  const notesList = document.getElementById("notes-list");

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
});
