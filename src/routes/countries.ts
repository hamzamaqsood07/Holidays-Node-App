import axios from 'axios';
import express from 'express';
import 'dotenv/config';
import config from 'config';

const countriesRouter = express.Router();
const apiKey = process.env.CALENDARIFIC_API_KEY;
const apiUrl: string = config.get('apiUrl');

countriesRouter.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/countries?api_key=${apiKey}`);
    res.send(response.data.response.countries);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

export { countriesRouter };