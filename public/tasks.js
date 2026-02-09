const API_TASKS = "/api/tasks";
const API_AUTH = "/api/auth";

// DOM Elements
const authDiv = document.querySelector(".auth");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const taskSection = document.querySelector(".task-form");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const board = document.querySelector(".task-board");

// JWT Token
let token = localStorage.getItem("token");

// UI toggle
function toggleTaskUI(show) {
  if (show) {
    authDiv.classList.add("hidden");
    taskSection.style.display = "flex";
    board.style.display = "block";
  } else {
    authDiv.classList.remove("hidden");
    taskSection.style.display = "none";
    board.style.display = "none";
  }
}

// Auth header
function authHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}

// LOAD TASKS
async function loadTasks() {
  const res = await fetch(API_TASKS, {
    headers: authHeader()
  });

  if (!res.ok) return;

  const tasks = await res.json();
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <span>${task.title}</span>
      <div class="actions">
        <button onclick="editTask('${task._id}', '${task.title}')">✏️</button>
        <button onclick="toggleComplete('${task._id}')">✔</button>
        <button onclick="deleteTask('${task._id}')">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// ADD TASK
async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  await fetch(API_TASKS, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ title })
  });

  taskInput.value = "";
  loadTasks();
}

// EDIT TASK
async function editTask(id, oldTitle) {
  const newTitle = prompt("Edit task", oldTitle);
  if (!newTitle) return;

  await fetch(`${API_TASKS}/${id}/edit`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ title: newTitle })
  });

  loadTasks();
}

// TOGGLE COMPLETE
async function toggleComplete(id) {
  await fetch(`${API_TASKS}/${id}`, {
    method: "PUT",
    headers: authHeader()
  });

  loadTasks();
}

// DELETE TASK
async function deleteTask(id) {
  await fetch(`${API_TASKS}/${id}`, {
    method: "DELETE",
    headers: authHeader()
  });

  loadTasks();
}

// REGISTER
async function register() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch(`${API_AUTH}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
}

// LOGIN
async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    toggleTaskUI(true);   // ✅ show task UI
    loadTasks();          // ✅ load tasks immediately
  } else {
    alert(data.message);
  }
}


// LOGOUT
function logout() {
  localStorage.removeItem("token");
  toggleTaskUI(false);
}

// EVENTS
addBtn.addEventListener("click", addTask);

window.onload = () => {
  toggleTaskUI(!!token);
  if (token) loadTasks();
};
