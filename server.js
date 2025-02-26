const express = require("express");
const path = require("path");
const session = require("express-session");
const mysql = require("mysql2");

// Configuração da conexão com o MySQL (sem senha)
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "viagem_db"
});

connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("Conectado ao MySQL!");
});

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "segredo123",
    resave: false,
    saveUninitialized: true
}));

// ✅ Buscar todos os pacotes
app.get("/pacotes", (req, res) => {
    connection.query("SELECT * FROM pacotes", (err, results) => {
        if (err) {
            res.status(500).send("Erro ao buscar pacotes");
            return;
        }
        res.json(results);
    });
});

// ✅ Criar um novo pacote
app.post("/pacotes", (req, res) => {
    const { nome, destino, data_partida, preco } = req.body;
    if (!nome || !destino || !data_partida || !preco) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    connection.query(
        "INSERT INTO pacotes (nome, destino, data_partida, preco) VALUES (?, ?, ?, ?)",
        [nome, destino, data_partida, preco],
        (err, result) => {
            if (err) {
                res.status(500).send("Erro ao adicionar pacote");
                return;
            }
            res.send("Pacote adicionado com sucesso");
        }
    );
});

// ✅ Atualizar um pacote existente
app.put("/pacotes/:id", (req, res) => {
    const { id } = req.params;
    const { nome, destino, data_partida, preco } = req.body;

    if (!nome || !destino || !data_partida || !preco) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    connection.query(
        "UPDATE pacotes SET nome = ?, destino = ?, data_partida = ?, preco = ? WHERE id = ?",
        [nome, destino, data_partida, preco, id],
        (err, result) => {
            if (err) {
                res.status(500).send("Erro ao atualizar pacote");
                return;
            }
            res.send("Pacote atualizado com sucesso");
        }
    );
});

// ✅ Excluir um pacote
app.delete("/pacotes/:id", (req, res) => {
    const { id } = req.params;

    connection.query("DELETE FROM pacotes WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao excluir pacote");
            return;
        }
        res.send("Pacote excluído com sucesso");
    });
});

// ✅ Buscar detalhes de um pacote específico
app.get("/pacotes/:id", (req, res) => {
    const { id } = req.params;

    connection.query("SELECT * FROM pacotes WHERE id = ?", [id], (err, results) => {
        if (err) {
            res.status(500).send("Erro ao buscar detalhes do pacote");
            return;
        }

        if (results.length === 0) {
            return res.status(404).send("Pacote não encontrado");
        }

        res.json(results[0]);
    });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
