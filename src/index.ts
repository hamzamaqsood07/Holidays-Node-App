import express from 'express';
import { countriesRouter } from './routes/countries';
import { holidaysRouter } from './routes/holidays';
import { checkEnv } from './startup/checkEnv';
import './startup/redis'; //starting up redis

checkEnv(); //checking required env variables before starting the server
const app = express();
app.use(express.json());
app.use('/countries', countriesRouter);
app.use('/holidays', holidaysRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));
