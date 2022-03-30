import express from 'express';
import Sequelize from 'sequelize';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * DB
 */
const db = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

db.authenticate()
    .then( () => console.log('Base de datos conectada'))
    .catch(error => console.log(error));

const registros = db.define('registros', {
    time:{
        type: Sequelize.STRING
    },
    date:{
        type: Sequelize.STRING
    },
    ip:{
        type: Sequelize.STRING
    }
});




/**
 * RUTAS
 */
app.post('/saveregister', async (req, res) =>{
    const {time, date, ip} = req.body;
    if(time !== undefined && date !== undefined && ip !== undefined){
        // Guardar en DB
        try{
            await registros.create({
                time,
                date,
                ip
            });

            res.json({msg: "Guardadito papá"});
        }catch(error){
            console.log(error)
            res.json({msg: "No se pudo GUARDAR mi rey"});
        }
    }else{
        res.json({msj: 'Datos inválidos'});
    }

});
app.get('/', async (req, res) =>{
    try{
        const reg = await registros.findAll();
        res.json(reg);
    }catch(err){
        console.log(err);
        res.json({msg: 'Chale, no se pudo'});
    }
});

// 404
app.use((req, res) =>{
    res.send('No existe, papá');
});



const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () =>{
    console.log("We're online, baby!");
});