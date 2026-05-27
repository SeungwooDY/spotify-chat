import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

const app=express();

// Specify a port number for the server
const port=process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/', authRouter);
app.use("/users", usersRouter);

// import router modules here

// use router modules

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
