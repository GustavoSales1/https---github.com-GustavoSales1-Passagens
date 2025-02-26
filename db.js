const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'localhost',
    password: "",
    database: 'viagem_db'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

module.exports = connection;
