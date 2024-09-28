/* imports */
require("dotenv").config({ path: "./.env" });
import express, { Request, Response } from "express";
import connectDB from "./src/models/dbConnection";
import cookieParser from "cookie-parser";
import cors from "cors";
const events = require('events');


const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();
events.EventEmitter.defaultMaxListeners = 20;

/* middleware */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

// Loger
import morgan from "morgan"
app.use(morgan("dev"));

// app.options('*', cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// app.use(cors({
//   origin: 'https://albokoes.vercel.app', // Specify the allowed origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'], // Include any headers your client might send
//   credentials: true, // Set this to true if you need to send cookies or other credentials
// }));


const allowedOrigins = [
	'https://albokoes.vercel.app/',"https://vercel.com/arpits-projects-1c6b9bf9/albokoes/AtiQ43gQECG3YmPf4GZXrcxC9n9T","https://www.albokoes.com/",
	"http://localhost:3000","https://albokoes.vercel.app/","https://albokoes-y64n.vercel.app/"
];

app.use(cors({
	origin: allowedOrigins,
	credentials: true,
	// optionsSuccessStatus: 200 ,// Address potential preflight request issues
	allowedHeaders: [
		'Content-Type', 
		'Authorization', 
		'X-Requested-With', 
		'Accept', 
		'Origin', 
		'X-Auth-Token'
	  ], // Specify the allowed headers for the CORS request
	  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

/* router */
import userRoutes from "./src/routes/userRouter";
import errorMiddleware from "./src/middlewares/errorMiddleware";
import serviceRouter from "./src/routes/serviceRouter";
import articalRouter from "./src/routes/newarticalRouter";
import eventRouter from "./src/routes/eventRouters";
import analyticsRouter from "./src/routes/analyticsRouter";

app.get("/",(req,res) =>{
  res.json({greed:"welcome to albokoes"})
})

app.use("/api/v1", userRoutes, serviceRouter, articalRouter ,eventRouter , analyticsRouter);

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
