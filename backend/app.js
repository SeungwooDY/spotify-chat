import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import spotifyRouter from "./routes/spotify.js";
import usersRouter from "./routes/users.js";
import forumRouter from './routes/forum.js';

const app = express();

// Specify a port number for the server
const port=process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URI,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/", authRouter);
app.use("/users", usersRouter);

// import router modules here

app.use('/api', spotifyRouter);
app.use('/forum', forumRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
