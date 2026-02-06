const API = "/api/tasks";

// Load tasks on page load
window.onload = fetchTasks;

function fetchTasks() {
  fetch(API)
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      tasks.forEach(task => {
        list.innerHTML += `
          <li>
            ${task.title}
            <span>
              <button onclick="completeTask('${task._id}')">✔</button>
              <button onclick="deleteTask('${task._id}')">❌</button>
            </span>
          </li>
        `;
      });
    });
}

function addTask() {
  const input = document.getElementById("taskInput");
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.value })
  }).then(() => {
    input.value = "";
    fetchTasks();
  });
}

function completeTask(id) {
  fetch(`${API}/${id}`, { method: "PUT" })
    .then(fetchTasks);
}

function deleteTask(id) {
  fetch(`${API}/${id}`, { method: "DELETE" })
    .then(fetchTasks);
}
