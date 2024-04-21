/* imports */
import express, { Request, Response } from "express";
import connectDB from "./src/models/dbConnection";
import cookieParser from "cookie-parser";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

/* router */
import itemsRoutes from "./src/routes/indexRouter";
import userRoutes from "./src/routes/userRouter";
import errorMiddleware from "./src/middlewares/errorMiddleware";

app.use("/api/items", itemsRoutes);
app.use("/api/users", userRoutes);

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
