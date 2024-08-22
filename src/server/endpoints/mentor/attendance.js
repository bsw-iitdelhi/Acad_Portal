import express from "express";
import Mentor from "../../models/mentor.js";
import multer from "multer";
import Attendance from "../../models/attendance.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../public/uploads/attendance");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/attendance"));
  },
  filename: function (req, file, cb) {
    // Generate a unique ID for the file
    const uniqueId = req.body.attendanceId || uuidv4();
    cb(null, `${uniqueId}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

//GET: get all attendance
router.get("/", async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ kerberos: req.body.kerberos });
    if (!mentor) {
      res.status(400).send("Mentor not found");
      return;
    }
    const attendances = await Attendance.find({ mentor: mentor._id });
    res.status(200).send(attendances);
  } catch (e) {
    res.status(500).send;
  }
});

router.post("/post", upload.single("photo"), async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ kerberos: req.body.kerberos });
    if (!mentor) {
      return res.status(400).send("Mentor not found");
    }

    // Generate a unique ID for the new attendance record
    const uniqueId = uuidv4();
    if (req.file) {
      const oldPath = req.file.path;
      const newFileName = `${uniqueId}${path.extname(req.file.originalname)}`;
      const newPath = path.join(
        __dirname,
        "../../public/uploads/attendance",
        newFileName
      );
      fs.renameSync(oldPath, newPath);
      req.body.photoPath = newFileName;
    }

    // Create the Attendance document with the unique ID
    const attendance = new Attendance({
      mentor: mentor._id,
      date: new Date(req.body.date),
      description: req.body.description,
      photoPath: req.body.photoPath,
    });
    await attendance.save();
     res.status(201).send(attendance);
    // If there's a file, rename it using the unique ID
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
