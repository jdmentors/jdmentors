import express from "express";
import "dotenv/config";
import dbConnect from "./db/index.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";

const app = express();
dbConnect();
const PORT = process.env.PORT || 3000;
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({limit:'16kb'}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})); 

app.get('/', (req, res) => res.send('Welcome Back!!'));
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));