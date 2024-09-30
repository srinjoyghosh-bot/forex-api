import express from 'express';
import bodyParser from 'body-parser';
import forexRoutes from './routes/forexRoutes';
import { connectDB } from './config/database';
import { Database } from 'sqlite';
import { errorHandler } from "./middlewares/errorMiddlewares";

const app = express();
const PORT =process.env.PORT ?? 3000;

app.use(bodyParser.json());

app.use('/api', forexRoutes);

app.use(errorHandler)

const setupDatabase = async () => {
  const db : Database = await connectDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS forex_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      currency_pair TEXT,
      open REAL,
      high REAL,
      low REAL,
      close REAL,
      volume INTEGER
    )
  `);
  console.log('Database setup complete');
};

app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`Server is running on port ${PORT}`);
});
