import express from 'express';
const holidaysRouter = express.Router();

import config from 'config';
import axios from 'axios';
const apiKey = process.env.CALENDARIFIC_API_KEY;
const apiUrl: string = config.get('apiUrl');

holidaysRouter.get('/', async (req, res) => {
  try {
    const { country, year } = req.query;
    const response = await axios.get(
      `${apiUrl}/holidays?country=${country}&year=${year}&api_key=${apiKey}`
    );
    res.send(response.data.response);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

export { holidaysRouter };
