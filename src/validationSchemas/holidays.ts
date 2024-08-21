import * as Yup from 'yup';

// Define a schema for query parameters
export const holidaysQuerySchema = Yup.object({
  country: Yup.string().required(),
  year: Yup.number().integer().min(1800).max(2400).required(),
});
