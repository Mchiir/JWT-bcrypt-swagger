import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router as authRouter } from "./APIs/APIs-bcrypt.js";
import { verifyJWT as userMiddleware } from "./APIs/VerifyToken.js";
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './Swagger/Swagger.json' assert { type: "json" };

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware provided by Express to parse incoming JSON requests.
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

mongoose.connect(MONGO_URL).then(() => {
    console.log("MongoDB is connected!");
});

app.use('/auth', authRouter);

app.get("/protected", userMiddleware, (req, res) => {
    const { username } = req.user;
    console.log(req);
    res.send(`This is a Protected Route. Welcome ${username}`);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});