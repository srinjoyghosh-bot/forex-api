import { Request, Response } from "express";
import { connectDB } from "../config/database";

export const getForexData = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const rows = await db.all(`SELECT * FROM forex_data`);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
