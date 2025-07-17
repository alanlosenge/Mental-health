document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  // Event listener for journal entry submission
  const saveButton = document.querySelector("button[onclick='saveJournal()']");
  if (saveButton) {
    saveButton.addEventListener("click", saveJournal);
  }

  // Event listener for clearing entries
  const clearButton = document.querySelector("button[onclick='clearAllEntries()']");
  if (clearButton) {
    clearButton.addEventListener("click", clearAllEntries);
  }

  loadEntries();
});

// ✅ Check if token exists
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
}

// ✅ Save Journal Entry to backend
async function saveJournal() {
  const token = localStorage.getItem("token");
  if (!token) return alert("You must be logged in.");

  const mood = document.getElementById("mood").value;
  const text = document.getElementById("journalText").value;

  if (!text.trim()) {
    return alert("Please enter some text.");
  }

  try {
    const res = await fetch("https://mental-health-gekz.onrender.com/api/journal/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ mood, text })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Journal saved successfully!");
      document.getElementById("journalText").value = "";
      loadEntries();
    } else {
      alert(data.message || "Failed to save entry.");
    }
  } catch (err) {
    alert("Error submitting entry.");
    console.error(err);
  }
}

// ✅ Load entries from server
async function loadEntries() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("https://mental-health-gekz.onrender.com/api/journal/entries", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    const container = document.getElementById("journalEntries");
    container.innerHTML = "";

    if (Array.isArray(data)) {
      data.forEach(entry => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
          <strong>${entry.mood}</strong> - 
          ${new Date(entry.date).toLocaleString()}<br/>
          <p>${entry.text}</p>
        `;
        container.appendChild(div);
      });
    } else {
      container.innerHTML = "<p>No entries found.</p>";
    }
  } catch (err) {
    console.error("Failed to load journal entries:", err);
  }
}

// ✅ Clear all displayed entries from the page (not the database)
function clearAllEntries() {
  const container = document.getElementById("journalEntries");
  container.innerHTML = "";
}
