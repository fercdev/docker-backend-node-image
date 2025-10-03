const express = require("express");
const { Sequelize } = require("sequelize");
const createUserModel = require("./models/user");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const DB_HOST = process.env.DB_HOST || "mysql-demo";
const DB_NAME = process.env.DB_NAME || "demo_db";
const DB_USER = process.env.DB_USER || "demo_user";
const DB_PASS = process.env.DB_PASS || "demo_pass";
const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

const User = createUserModel(sequelize);

async function startApi() {
    try {
        await sequelize.authenticate();
        console.log('DB conectada');

        await sequelize.sync();
        console.log('Tabla sincronizadas');
    } catch (e) {
        console.error("Error en conexion:", e);
        process.exit(1);
    }

    // CRUD 
    app.get('/users', async (req, res) => {
        const users = await User.findAll();
        res.json(users);
    });


    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`API corriendo en el puerto ${PORT}`));
}

startApi();