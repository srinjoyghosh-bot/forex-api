import { ForexData } from "../models/forexData";
import { connectDB } from "../config/database";
import { addMonths, addWeeks, addYears, format } from "date-fns";

export const getForexData = async (
  from: string,
  to: string,
  period: string
): Promise<ForexData[]> => {
  const db = await connectDB();
  const now = new Date();

  let startDate: Date;
  try {
    if (period.endsWith("M")) {
      const months = parseInt(period.slice(0, -1), 10);
      startDate = addMonths(now, -months);
    } else if (period.endsWith("W")) {
      const weeks = parseInt(period.slice(0, -1), 10);
      startDate = addWeeks(now, -weeks);
    } else if (period.endsWith("Y")) {
      const years = parseInt(period.slice(0, -1), 10);
      startDate = addYears(now, -years);
    } else {
      throw new Error("Invalid period format. Use 'xM', 'xW', or 'xY'.");
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");

    const query = `
      SELECT * FROM forex_data
      WHERE currency_pair = ?
      AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `;

    const rows: ForexData[] = await db.all(query, [
      `${from}${to}=X`,
      formattedStartDate,
      format(now, "yyyy-MM-dd"),
    ]);

    return rows;
  } catch (error) {
    console.error("Error fetching forex data:", error);
    throw error;
  } finally {
    await db.close();
  }
};
