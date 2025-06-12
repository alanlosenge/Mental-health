let moodChartInstance;

// ---------------- Mood Chart Logic ----------------
function generateMoodChart() {
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  const moodMap = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date).toLocaleDateString();
    if (!moodMap[date]) {
      moodMap[date] = {};
    }
    moodMap[date][entry.mood] = (moodMap[date][entry.mood] || 0) + 1;
  });

  const moods = ["Happy", "Sad", "Stressed", "Anxious", "Neutral"];
  const sortedDates = Object.keys(moodMap).sort((a, b) => new Date(a) - new Date(b));

  const datasets = moods.map((mood) => {
    return {
      label: mood,
      data: sortedDates.map((date) => (moodMap[date]?.[mood] || 0)),
      fill: false,
      borderColor: getMoodColor(mood),
      tension: 0.1
    };
  });

  const ctx = document.getElementById("moodChart").getContext("2d");

  if (moodChartInstance) {
    moodChartInstance.destroy();
  }

  moodChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Mood Trends Over Time'
        }
      }
    }
  });
}

function getMoodColor(mood) {
  switch (mood) {
    case "Happy": return "#4CAF50";
    case "Sad": return "#2196F3";
    case "Stressed": return "#FF9800";
    case "Anxious": return "#E91E63";
    case "Neutral": return "#9E9E9E";
    default: return "#000";
  }
}

// ---------------- Journal Logic ----------------
function saveJournal() {
  const mood = document.getElementById("mood").value;
  const text = document.getElementById("journalText").value.trim();
  if (!text) {
    alert("Please write something before saving.");
    return;
  }

  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  const newEntry = {
    mood,
    text,
    date: new Date().toISOString()
  };

  entries.push(newEntry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));

  document.getElementById("journalText").value = "";
  alert("Journal entry saved!");
  displayJournalEntries();
  generateMoodChart();
}

function displayJournalEntries() {
  const container = document.getElementById("journalEntries");
  container.innerHTML = "";
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

  if (entries.length === 0) {
    container.innerHTML = "<p>No entries yet.</p>";
    return;
  }

  entries.forEach((entry, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = `
      <strong>Mood: ${entry.mood}</strong>
      <p>${entry.text}</p>
      <span>${new Date(entry.date).toLocaleString()}</span>
      <button onclick="deleteEntry(${index})">Delete</button>
    `;
    container.appendChild(entryDiv);
  });
}

function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  entries.splice(index, 1);
  localStorage.setItem("journalEntries", JSON.stringify(entries));
  displayJournalEntries();
  generateMoodChart();
}

function clearAllEntries() {
  if (confirm("Are you sure you want to delete all entries?")) {
    localStorage.removeItem("journalEntries");
    displayJournalEntries();
    generateMoodChart();
  }
}

// ---------------- Tips Logic ----------------
const tips = [
  "Take a short walk to clear your mind.",
  "Practice deep breathing exercises.",
  "Write down three things you’re grateful for.",
  "Take a break from social media.",
  "Talk to a friend or family member.",
  "Listen to calming music.",
  "Try meditation or mindfulness.",
  "Make sure to get enough sleep."
];

function generateTip() {
  const randomIndex = Math.floor(Math.random() * tips.length);
  document.getElementById("tipDisplay").textContent = tips[randomIndex];
}

// ---------------- Contact Form ----------------
function submitContactForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  alert("Thank you for reaching out! We will get back to you soon.");
  document.getElementById("contactForm").reset();
}

// ---------------- Calendar Logic ----------------
const calendarContainer = document.getElementById("calendarContainer");

function generateCalendar(year, month) {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let html = `<table><thead><tr><th colspan="7">${monthNames[month]} ${year}</th></tr><tr>
    <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
    <th>Thu</th><th>Fri</th><th>Sat</th>
  </tr></thead><tbody><tr>`;

  // Fill blanks before first day
  for (let i = 0; i < firstDay.getDay(); i++) {
    html += "<td></td>";
  }

  // Fill days of month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const isToday = today.toDateString() === date.toDateString();

    // Check if there are journal entries for this date
    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const dayEntries = entries.filter(e => new Date(e.date).toDateString() === date.toDateString());

    let classes = "";
    if (isToday) classes = "active";

    html += `<td class="${classes}" onclick="showEntries('${date.toDateString()}')">${day}`;
    if (dayEntries.length > 0) {
      html += `<br><small>${dayEntries.length} entries</small>`;
    }
    html += "</td>";

    if ((day + firstDay.getDay()) % 7 === 0) {
      html += "</tr><tr>";
    }
  }

  // Fill blanks after last day
  const remainingCells = 7 - ((lastDay.getDate() + firstDay.getDay()) % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      html += "<td></td>";
    }
  }

  html += "</tr></tbody></table>";
  calendarContainer.innerHTML = html;
}

function showEntries(dateStr) {
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  const filteredEntries = entries.filter(e => new Date(e.date).toDateString() === dateStr);

  if (filteredEntries.length === 0) {
    alert(`No entries for ${dateStr}`);
    return;
  }

  let message = `Entries for ${dateStr}:\n\n`;
  filteredEntries.forEach((entry, i) => {
    message += `${i + 1}. [${entry.mood}] ${entry.text}\n\n`;
  });

  alert(message);
}

// ---------------- Scroll Spy and Navbar Effects ----------------

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSectionId = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSectionId) {
      link.classList.add("active");
    }
  });
});

// ---------------- Initialize ----------------

document.addEventListener("DOMContentLoaded", () => {
  displayJournalEntries();
  generateMoodChart();

  const now = new Date();
  generateCalendar(now.getFullYear(), now.getMonth());

  generateTip();
});
