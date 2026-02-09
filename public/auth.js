const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const messageDiv = document.getElementById("message");

const API = "/api/auth";

loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  messageDiv.innerText = data.message;

  if (res.ok) {
    messageDiv.classList.add("success");
    messageDiv.classList.remove("error");
  } else {
    messageDiv.classList.add("error");
    messageDiv.classList.remove("success");
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "/tasks.html";
  } else {
    messageDiv.innerText = data.message;
    messageDiv.classList.add("error");
    messageDiv.classList.remove("success");
  }
}
