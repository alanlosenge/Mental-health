const BASE_URL = "https://mental-health-gekz.onrender.com";

// Sign up (localStorage simulation – optional if using backend only)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    localStorage.setItem(`user_${username}`, password);
    alert("Account created! Please log in.");
    window.location.href = "login.html";
  });
}

// Log in (localStorage simulation – optional if using backend only)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const storedPassword = localStorage.getItem(`user_${username}`);

    if (storedPassword === password) {
      localStorage.setItem("loggedInUser", username);
      alert("Login successful!");
      window.location.href = "index.html"; // or dashboard
    } else {
      alert("Invalid credentials");
    }
  });
}

// Signup using backend API
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    alert("Signup successful!");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Signup failed. Try again.");
  }
});

// Login using backend API
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert(data.message || "Login failed. Check credentials.");
  }
});
