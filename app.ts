/* imports */
require("dotenv").config({ path: "./.env" });
import express, { Request, Response } from "express";
import connectDB from "./src/models/dbConnection";
import cookieParser from "cookie-parser";
import cors from "cors";


const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

// Loger
import morgan from "morgan"
app.use(morgan("dev"));

app.use(cors({
  origin: 'http://localhost:3000', // Specify the allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Include any headers your client might send
  credentials: true, // Set this to true if you need to send cookies or other credentials
}));

/* router */
import userRoutes from "./src/routes/userRouter";
import errorMiddleware from "./src/middlewares/errorMiddleware";
import serviceRouter from "./src/routes/serviceRouter";

app.get("/",(req,res) =>{
  res.json({greed:"welcome to albokoes"})
})

app.use("/api/v1", userRoutes, serviceRouter);

/* 404 */
app.get("*", (req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found",
  });
});

/* error Handling */
app.use(errorMiddleware);

/* server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
