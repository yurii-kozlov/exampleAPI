import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { register } from 'tsconfig-paths';
import router from './router/router';
import handleErrors from './middlewares/error-middleware';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}
register();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api', router);
app.use(handleErrors);

const start = async () => {
  try {
      await mongoose.connect(process.env.DB_URL);
      app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`));
  } catch (error) {
      console.log(error);
  }
}

start();
