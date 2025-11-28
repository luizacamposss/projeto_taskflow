const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cimatec",
    database: "tasksdb"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("MySQL conectado!");
});

app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks ORDER BY due_date ASC", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post("/tasks", (req, res) => {
    const { title, due_date } = req.body;
    db.query(
        "INSERT INTO tasks (title, due_date) VALUES (?, ?)",
        [title, due_date],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Tarefa criada!" });
        }
    );
});

app.put("/tasks/:id", (req, res) => {
    const { title, due_date } = req.body;
    db.query(
        "UPDATE tasks SET title=?, due_date=? WHERE id=?",
        [title, due_date, req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Tarefa editada!" });
        }
    );
});

app.put("/tasks/:id/done", (req, res) => {
    db.query(
        "UPDATE tasks SET done=1 WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Tarefa concluída!" });
        }
    );
});

app.delete("/tasks/:id", (req, res) => {
    db.query(
        "DELETE FROM tasks WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Tarefa removida!" });
        }
    );
});

app.listen(3200, () => console.log("API rodando na porta 3200"));
