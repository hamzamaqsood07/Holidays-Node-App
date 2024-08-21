import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { holidaysRouter } from '../src/routes/holidays';
import config from 'config';

// Mock Redis client using factory function
jest.mock('../src/startup/redis', () => {
  // Create a new redisMock client for each test
  const redisMockClient = require('redis-mock').createClient();
  return {
    __esModule: true,
    redisClient: redisMockClient,
  };
});

// Mock axios
jest.mock('axios');

// Setup Express app with the holidaysRouter
const app = express();
app.use('/holidays', holidaysRouter);

describe('GET /holidays', () => {
  it('should return cached data from Redis', async () => {
    const mockResponseData = { holidays: [] };

    // Mock Redis cache response
    const { redisClient } = require('../src/startup/redis');
    redisClient.get = jest
      .fn()
      .mockResolvedValue(JSON.stringify(mockResponseData));

    // Perform request
    const response = await request(app)
      .get('/holidays?country=US&year=2024')
      .expect('Content-Type', /json/)
      .expect(200);

    // Check response
    expect(response.body).toEqual(mockResponseData);
    expect(redisClient.get).toHaveBeenCalledWith('cache:holidays/US/2024');
  });

  it('should fetch and cache data from external API', async () => {
    const mockResponseData = { holidays: [] };

    // Mock axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: { response: mockResponseData },
    });

    // Mock Redis client
    const { redisClient } = require('../src/startup/redis');
    redisClient.get = jest.fn().mockResolvedValue(null);
    redisClient.set = jest.fn().mockResolvedValue('OK');

    // Perform request
    const response = await request(app)
      .get('/holidays?country=US&year=2024')
      .expect('Content-Type', /json/)
      .expect(200);

    // Check response
    expect(response.body).toEqual(mockResponseData);
    const apiKey = process.env.CALENDARIFIC_API_KEY;
    const apiUrl: string = config.get('apiUrl');
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}/holidays?country=US&year=2024&api_key=${apiKey}`
    );
    expect(redisClient.set).toHaveBeenCalledWith(
      'cache:holidays/US/2024',
      JSON.stringify(mockResponseData),
      { EX: 3600 }
    );
  });

  it('should return 500 if there is an error', async () => {
    // Mock Redis client to throw an error
    const { redisClient } = require('../src/startup/redis');
    redisClient.get = jest.fn().mockRejectedValue(new Error('Redis error'));

    // Perform request
    const response = await request(app)
      .get('/holidays?country=US&year=2024')
      .expect(500);

    // Check response
    expect(response.text).toBe('');
  });
});

