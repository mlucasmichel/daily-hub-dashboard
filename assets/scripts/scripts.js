document.addEventListener("DOMContentLoaded", function () {
    const notesForm = document.getElementById("notes-form");
    const notesInput = document.getElementById("notes-input");
    const notesList = document.getElementById("notes-list");

    /** Loads notes from localStorage and displays them */
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notesList.innerHTML = "";

        notes.forEach()(note => {
            const li = document.createElement("li");
            li.textContent = note;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.dataset.id = note.id;
            li.appendChild(deleteBtn);

            notesList.appendChild(li);
        });
    }

    loadNotes();
});