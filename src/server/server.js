import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//db connection....
try {
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.log(err);
}

import endpoints from "./endpoints/index.js";
app.use("/api", endpoints);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
