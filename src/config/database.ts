import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open a database handle
export const connectDB = async () => {
  return open({
    filename: "data/forex_data.db",
    driver: sqlite3.Database,
  });
};
