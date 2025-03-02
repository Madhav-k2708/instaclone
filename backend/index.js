import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from 'path'


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve()

app.get("/", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Backend Running Successfully",
  });
});
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Routers 
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/message",messageRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')))
app.get("*", (req,res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
