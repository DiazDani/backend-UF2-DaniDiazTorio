const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

port = 3080;

app.listen(port, ()=>{
  console.log(`el port::${port} funciona`)
});


const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'patata',
  database: 'unidanieldiaz',
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de dades:', error);
  } else {
    console.log('Conexió exitosa');
  }
});
