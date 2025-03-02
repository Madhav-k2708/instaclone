import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const messageRouter = Router()

messageRouter.post("/send/:id", isAuthenticated, sendMessage)
messageRouter.get("/all/:id", isAuthenticated, getMessage)

export default messageRouter