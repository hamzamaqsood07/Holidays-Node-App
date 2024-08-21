import express from 'express';
const holidaysRouter = express.Router();

import config from 'config';
import axios from 'axios';
const apiKey = process.env.CALENDARIFIC_API_KEY;
const apiUrl: string = config.get('apiUrl');
const cacheTTL: number = config.get('cacheTTL');

import { redisClient } from '../startup/redis';
import { validateQueryParams } from '../middlewares/validation';
import { holidaysQuerySchema } from '../validationSchemas/holidays';

holidaysRouter.get(
  '/',
  validateQueryParams(holidaysQuerySchema),
  async (req, res) => {
    try {
      const { country, year } = req.query;
      const redisKey = `cache:holidays/${country}/${year}`;
      const cachedData = await redisClient.get(redisKey);
      if (cachedData) {
        console.log('Sending response from cache');
        return res.send(JSON.parse(cachedData));
      }
      const response = await axios.get(
        `${apiUrl}/holidays?country=${country}&year=${year}&api_key=${apiKey}`
      );
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
  }
);

export { holidaysRouter };
