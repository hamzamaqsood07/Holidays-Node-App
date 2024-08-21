import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { holidaysRouter } from '../src/routes/holidays';

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

describe('Validation Middleware', () => {
  it('should pass valid data', async () => {
    const validData = {
      country: 'US',
      year: '2024',
    };

    const mockResponse = {
      data: {
        response: {
          holidays: [],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await request(app)
      .get('/holidays')
      .query(validData)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data.response);
  });

  it('should reject invalid data', async () => {
    const invalidData = {
      country: '',
      year: 'invalid',
    };

    // Perform request with invalid data
    const response = await request(app)
      .get('/holidays')
      .query(invalidData)
      .expect(400);

    // Check response for invalid data
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
