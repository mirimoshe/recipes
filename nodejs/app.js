import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { categoryRouter } from './routes/category.route.js';
import { recipeRouter } from './routes/recipe.route.js';
import { userRouter } from './routes/user.route.js';
import {pageNotFound,serverNotFound} from './middlewares/handleErrors.js';
import './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
    res.send("wellcome");
});

app.use("/category", categoryRouter);
app.use("/recipe", recipeRouter);
app.use("/user", userRouter);

app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});