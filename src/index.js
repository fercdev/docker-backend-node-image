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
    app.post('/users', async (req, res) => {
        const user = await User.create(req.body);
        res.status(201).json(user);
    });

    app.get('/users', async (req, res) => {
        const users = await User.findAll();
        res.json(users);
    });

    app.get('/users/:id', async (req, res) => {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({error: "Not found"})
        res.json(user);
    });

    app.put('/users/:id', async (req, res) => {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({error: "Not found"})
        await user.update(req.body)
        res.json(user);
    });

    app.delete('/users/:id', async (req, res) => {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({error: "Not found"})
        await user.destroy();
        res.json(204).send();
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`API corriendo en el puerto ${PORT}`));
}

startApi();