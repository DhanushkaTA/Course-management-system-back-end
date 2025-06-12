import express from "express";
import {chatWithOpenAi} from "../controller/ChatController";

let router = express.Router();

router.post("/suggest-courses", chatWithOpenAi);

export default router;