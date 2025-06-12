// Sign up
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

// Log in
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
