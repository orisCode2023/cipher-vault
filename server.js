import express from 'express';
import { initMongoDb } from './utils/mongodbC.js';
import { initSqlDb } from './utils/sqlC.js';
import { getMongoDb } from './utils/mongodbC.js';
import { getSqlConn } from './utils/sqlC.js';

// Import route modules for organizing endpoints
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(async (req, res, next) => {
    req.mongoDbConn = await getMongoDb();
    req.mysqlConn = await getSqlConn();
    next();
});

// Mount the product routes under the /api/products path
// All product-related endpoints will be handled by productRoutes
app.use('/api/products', productRoutes);

// Mount the order routes under the /api/orders path
// All order-related endpoints will be handled by orderRoutes
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'welcome to cipher vault' });
});


async function startServer() {
    await initMongoDb();
    await initSqlDb();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();

// process.on('SIGINT', async () => {
//     console.log('Shutting down...');
//     if (mongoClient) await mongoClient.close();
//     if (mysqlConnection) await mysqlConnection.end();
//     process.exit(0);
// });