import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import forexRoutes from "./routes/forexRoutes";
import { connectDB } from "./config/database";
import { Database } from "sqlite";
import { errorHandler } from "./middlewares/errorMiddlewares";
import {scheduleScrapingTasks} from "./utils/scrapingUtils"

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(helmet());

app.use("/api", forexRoutes);

app.use(errorHandler);

const setupDatabase = async () => {
  const db: Database = await connectDB();
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
  console.log("Database setup complete");
};

scheduleScrapingTasks()

app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`Server is running on port ${PORT}`);
});
