import { Router } from "express";
import { fetchForexData } from "../controllers/forexController";
import { validate } from "../middlewares/validationMiddleware";
import { check } from "express-validator";

const router = Router();

router.get(
  "/forex-data",
  [
    check("from")
      .exists()
      .withMessage("The from parameter is required")
      .isString()
      .withMessage("The from parameter must be a string")
      .isLength({ min: 3, max: 3 })
      .withMessage("The from parameter must be a 3-letter currency code"),

    check("to")
      .exists()
      .withMessage("The to parameter is required")
      .isString()
      .withMessage("The to parameter must be a string")
      .isLength({ min: 3, max: 3 })
      .withMessage("The to parameter must be a 3-letter currency code"),

    check("period")
      .exists()
      .withMessage("The period parameter is required")
      .matches(/^\d+[MWY]$/)
      .withMessage(
        "The period parameter must be in the format xM, xW, or xY (e.g., 1M, 2W, 5Y)"
      ),
  ],
  validate,
  fetchForexData
);

export default router;
