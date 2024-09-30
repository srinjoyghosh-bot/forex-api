import { Request, Response , NextFunction} from "express";
import { getForexData } from '../services/forexService';
import { ForexData } from '../models/forexData';
import { formatResponse } from '../utils/responseFormatter';


export const fetchForexData = async (req: Request, res: Response,next : NextFunction ) => {
    try {
        const from = req.query.from as string;
        const to = req.query.to as string;
        const period = req.query.period as string;
    
        if (!from || !to || !period) {
           res.status(400).json({ error: "Missing 'from', 'to', or 'period' query parameter" });
           return;
        }
    
        const forexData : ForexData[] = await getForexData(from, to, period);
    
         res.status(200).json(formatResponse(true,"Forex Data fetched successfully",forexData));
      } catch (error) {
        console.error(error);
        next(error)
      }
  };
