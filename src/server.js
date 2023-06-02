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

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('unidanieldiaz', 'root', 'patata', {
  host: 'localhost',
  dialect: 'mysql'
});

const ALUMNES = sequelize.define('ALUMNES', {
  ALUMN_DNI: {
    type: DataTypes.STRING(30),
    allowNull: false,
    primaryKey: true
  },
  ALUMN_NOM: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_COGNOM_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_COGNOM_2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_ADRECA: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_CODI_POSTAL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_POBLACIO: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_COMARCA: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_TELEFON: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ALUMN_DATA_NAIXEMENT: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ALUMN_CASAT: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ALUMN_E_MAIL: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'ALUMNES',
  timestamps: false
});

const Matricula= sequelize.define(
  'MATRICULA', {
    MATR_ALUM_DNI: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    MATR_NOTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    tableName: 'MATRICULA',
    timestamps: false
  });

ALUMNES.hasOne(Matricula, {
  foreignKey: 'MATR_ALUM_DNI',
  sourceKey: 'ALUMN_DNI'
});
Matricula.belongsTo(ALUMNES, {
  foreignKey: 'MATR_ALUM_DNI',
  targetKey: 'ALUMN_DNI'
});

sequelize.sync().then(()=>{
  console.log('Base de dades sincroniotzada');
}).catch((error) => {
  console.error("No s'ha pogut sincronitzar", error);
});

app.get('/naiDe10', async (req, res) => {
  ALUMNES.findOne({
    include: {
      model: Matricula,
      where: {
        MATR_NOTA: 10
      }
    }
  }).then((data)=>{
    res.json(data)
  }).catch((error)=>{
    console.error(error)
  })
});
