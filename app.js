const api = "http://localhost:3200/tasks";
let tasks = [];
let editingId = null;

async function loadTasks() {
    const res = await fetch(api);
    tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(list) {
    const container = document.getElementById("taskList");
    container.innerHTML = "";

    list.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>Data: ${task.due_date?.slice(0, 10) || "—"}</p>
            <p>Status: ${task.done ? "✔ Concluída" : "⏳ Pendente"}</p>

            <button onclick="editTask(${task.id})">Editar</button>
            <button onclick="markDone(${task.id})">Concluir</button>
            <button onclick="deleteTask(${task.id})">Excluir</button>
        `;

        container.appendChild(div);
    });
}

async function addTask() {
    const title = document.getElementById("title").value;
    const due = document.getElementById("due_date").value;

    await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, due_date: due })
    });

    loadTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);

    editingId = id;

    document.getElementById("edit-id").value = id;
    document.getElementById("edit-title").value = task.title;
    document.getElementById("edit-date").value = task.due_date?.slice(0, 10) || "";

    document.querySelector(".edit-box").style.display = "block";
}

async function saveEdit() {
    const title = document.getElementById("edit-title").value;
    const due = document.getElementById("edit-date").value;

    if (!editingId) {
        alert("Erro: ID da tarefa não encontrado.");
        return;
    }

    try {
        const res = await fetch(`${api}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, due_date: due })
        });

        const text = await res.text();
        let body;
        try { body = JSON.parse(text); }
        catch { body = text; }

        if (!res.ok) {
            alert("Erro ao atualizar: " + (body.message || JSON.stringify(body)));
            console.error("Erro do servidor:", body);
            return;
        }

        document.querySelector(".edit-box").style.display = "none";
        editingId = null;
        loadTasks();

    } catch (err) {
        alert("Erro ao enviar requisição: " + err.message);
        console.error(err);
    }
}

async function markDone(id) {
    await fetch(`${api}/${id}/done`, { method: "PUT" });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    loadTasks();
}

function showJSON() {
    alert(JSON.stringify(tasks, null, 2));
}

function orderByDate() {
    const sorted = [...tasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    renderTasks(sorted);
}

function orderByTitle() {
    const sorted = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    renderTasks(sorted);
}

loadTasks();
