import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

export const validateQueryParams =
  (schema: Yup.Schema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query, { abortEarly: false });
      next();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        console.error(err.errors);
        res.status(400).json({
          errors: err.errors, // Yup error messages
        });
      } else {
        console.error(err);
        res.status(500).send();
      }
    }
  };
