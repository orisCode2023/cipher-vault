import express from 'express';
import { initMongoDb, getMongoDb } from './utils/mongodbC.js';
import { initSqlDb, getSqlConn } from './utils/sqlC.js';
import messageRoutes from './routes/messages-route.js';
import usersRoutes from './routes/users-route.js';

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(async (req, res, next) => {
    req.mongoDbConn = await getMongoDb();
    req.mysqlConn = await getSqlConn();
    next();
});


app.use('/api/auth/', usersRoutes);
app.use('/api/users/', usersRoutes);
app.use('/api/messages/', messageRoutes);



app.get('/', (req, res) => {
    res.json({ message: 'welcome to cipher vault' });
});


async function startServer() {
    
    app.listen(PORT,async () => {
        await initMongoDb();
        await initSqlDb();
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
