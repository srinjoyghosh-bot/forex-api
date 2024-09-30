import { Request, Response } from "express";
import { getForexData } from '../services/forexService';
import { ForexData } from '../models/forexData';


export const fetchForexData = async (req: Request, res: Response) => {
    try {
        const from = req.query.from as string;
        const to = req.query.to as string;
        const period = req.query.period as string;
    
        if (!from || !to || !period) {
           res.status(400).json({ error: "Missing 'from', 'to', or 'period' query parameter" });
           return;
        }
    
        const forexData : ForexData[] = await getForexData(from, to, period);
    
         res.json(forexData);
      } catch (error) {
        console.error(error);
         res.status(500).json({ error: 'Internal Server Error' });
      }
  };
