const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/estudantes');
});

app.get('/estudantes', (req, res) => {
    res.sendFile(path.join(__dirname, 'estudantes.html'));
});

app.post('/estudantes', (req, res) => {
    res.send('Formulário recebido!');
});

app.listen(3006, () => {
    console.log('Servidor rodando em http://localhost:3006');
});