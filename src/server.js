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
    afegirCampAlumVirgen();
  }
});

function afegirCampAlumVirgen() {
  const query = `
    ALTER TABLE ALUMNES
    ADD ALUM_VIRGEN INTEGER DEFAULT 0;
  `;

  connection.query(query, (error) => {
    if (error) {
      console.error('Error:', error);
      throw new Error('Maria, maria...');
    } else {
      console.log('Campo ALUM_VIRGEN afegit exitosament');
    }
  });
}

app.get('/llistaProf', (req, res) => {
  const query = `
    SELECT PROF_DNI, PROF_NOM, PROF_COGNOM_1, PROF_COGNOM_2, PROF_TELEFON
    FROM PROFESSOR, DEPARTAMENT
    WHERE PROF_DEPT_CODI = DEPT_CODI AND PROF_CATEGORIA = 'Associat' AND DEPT_NOM != 'MULTIMEDIA';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtenir les dades' });
    } else {
      res.json(results);
    }
  });
});
