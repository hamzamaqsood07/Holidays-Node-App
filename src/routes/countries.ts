import axios from 'axios';
import express from 'express';
import 'dotenv/config';
import config from 'config';
const cacheTTL: number = config.get('cacheTTL');

import { redisClient } from '../startup/redis';

const countriesRouter = express.Router();
const apiKey = process.env.CALENDARIFIC_API_KEY;
const apiUrl: string = config.get('apiUrl');

countriesRouter.get('/', async (req, res) => {
  try {
    const redisKey = `cache:countries`;
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      console.log('Sending response from cache');
      return res.send(JSON.parse(cachedData));
    }
    const response = await axios.get(`${apiUrl}/countries?api_key=${apiKey}`);
    const responseData = response.data.response;
    // Store data in cache with an expiration time
    await redisClient.set(redisKey, JSON.stringify(responseData), {
      EX: cacheTTL,
    });
    res.send(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

export { countriesRouter };
