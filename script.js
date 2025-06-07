const taskInput = document.getElementById("task-input");
const taskDateInput = document.getElementById("task-date");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const liveDateTime = document.getElementById("live-date-time");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearAllBtn = document.getElementById("clear-all");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function setDefaultDate() {
  const now = new Date();
  const dateLocal = now.toISOString().slice(0, 16);
  taskDateInput.value = dateLocal;
}
setDefaultDate();

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = [...tasks];

  if (currentFilter === "active") {
    filteredTasks = filteredTasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((t) => t.completed);
  } else if (currentFilter === "previous") {
    const today = new Date();
    filteredTasks = filteredTasks.filter((t) => t.date && new Date(t.date) < today);
  } else if (currentFilter === "upcoming") {
    const today = new Date();
    filteredTasks = filteredTasks.filter((t) => t.date && new Date(t.date) > today);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li style="text-align:center; color: #555;">No tasks found</li>';
    return;
  }

  filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task);

    const li = document.createElement("li");
    li.className = task.completed ? "checked" : "";

    const checkbox = document.createElement("span");
    checkbox.className = "checkbox";
    if (task.completed) checkbox.classList.add("checked");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const taskDateTime = document.createElement("span");
    taskDateTime.className = "task-date-time";
    if (task.date) {
      const dateObj = new Date(task.date);
      taskDateTime.textContent = dateObj.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";

    li.appendChild(checkbox);
    li.appendChild(taskText);
    if (task.date) li.appendChild(taskDateTime);
    li.appendChild(deleteBtn);

    checkbox.addEventListener("click", () => toggleTaskCompletion(index));
    taskText.addEventListener("click", () => toggleTaskCompletion(index));
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(index);
    });

    taskList.appendChild(li);
  });
}

function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("Please enter a task.");

  let dateVal = taskDateInput.value;
  if (dateVal) {
    dateVal = new Date(dateVal).toISOString();
  } else {
    dateVal = null;
  }

  tasks.push({
    text,
    completed: false,
    date: dateVal,
  });
  saveTasks();
  renderTasks();

  taskInput.value = "";
  setDefaultDate();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

function updateLiveDateTime() {
  const now = new Date();
  liveDateTime.textContent = now.toLocaleString();
}
setInterval(updateLiveDateTime, 1000);
updateLiveDateTime();

renderTasks();
