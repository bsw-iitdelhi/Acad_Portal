import express from "express";
import Query from "../../models/query.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Student from "../../models/student.js";
import { ObjectId } from "mongodb";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

const queries_router = express.Router();

//multer setup....
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../public/uploads/queries");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Set the upload directory
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4(); // Generate a UUID
    const extension = path.extname(file.originalname); // Extract the original file extension
    const newFilename = `${uniqueId}${extension}`; // Create the new filename
    cb(null, newFilename); // Save the file with the new filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

queries_router.post(
  "/create",
  upload.array("attachments", 5),
  async (req, res) => {
    console.log(req.body);
    try {
      const student = await Student.findOne({ kerberos: req.body.kerberos });
      if (!student) {
        return res.status(400).send("Student not found");
      }
      // just store to the file name....
      const filePaths = req.files.map((file) => file.filename);
      const query = new Query({
        student: student._id,
        type: req.body.type,
        description: req.body.description,
        attachments: filePaths,
      });

      await query.save();
      res.status(201).send(query);
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

//GET: /student/queries?qid=&kerberos= - query of a student
queries_router.get("/one", async (req, res) => {
  try {
    const student = await Student.findOne({ kerberos: req.query.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    const qid = req.query.qid;
    if (!qid) {
      res.status(400).send("Query ID not found");
      return;
    }
    const queries = await Query.find({
      student: student._id,
      _id: new ObjectId(qid),
      status: "QUEUED",
    });
    if (queries.length == 0) {
      res.status(400).send("Query not found");
      return;
    }
    res.status(200).send(queries[0]);
  } catch (e) {
    res.status(500).send(e);
  }
});

//GET: /student/queries?kerberos=  - Get all queries of a student
queries_router.get("/", async (req, res) => {
  try {
    const student = await Student.findOne({ kerberos: req.query.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    const queries = await Query.find({ student: student._id });
    res.status(200).send(queries);
  } catch (e) {
    res.status(500).send(e);
  }
});

//GET: /student/queries/taken - Get all resolved queries of a student
queries_router.get("/taken", async (req, res) => {
  try {
    const student = await Student.findOne({ kerberos: req.body.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    const queries = await Query.find({ student: student._id, status: "TAKEN" });
    res.status(200).send(queries);
  } catch (e) {
    res.status(500).send(e);
  }
});

//UPDATE: /student/queries/resolve/:id - Resolve a query
queries_router.patch("/resolve/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ kerberos: req.body.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    const query = await Query.findOne({
      _id: new ObjectId(req.params.id),
      student: student._id,
      status: "TAKEN",
    });
    if (!query) {
      res.status(400).send("Query not found");
      return;
    }
    query.status = "RESOLVED";
    if (req.body.feedback) {
      query.feedback = req.body.feedback;
    }
    query.resolved_at = Date.now();
    await query.save();
    res.status(200).send(query);
  } catch (e) {
    res.status(500).send(e);
  }
});

//UPDATE: /student/queries/update/:id - Update a query
queries_router.patch(
  "/update/:id",
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      console.log(req.body);
      const student = await Student.findOne({ kerberos: req.body.kerberos });
      if (!student) {
        res.status(400).send("Student not found");
        return;
      }
      const query = await Query.findOne({
        _id: req.params.id,
        student: student._id,
        status: "QUEUED",
      });
      console.log(query);
      if (!query) {
        res.status(400).send("Query not found");
        return;
      }
      if (req.body.type) {
        query.type = req.body.type;
      }
      if (req.body.description) {
        query.description = req.body.description;
      }
      if (req.files) {
        const filePaths = req.files.map((file) => file.filename);
        query.attachments = filePaths;
      }
      await query.save();
      res.status(200).send(query);
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

//DELETE: /student/queries/delete/:id - Delete a query
queries_router.delete("/delete/:id", async (req, res) => {
  try {
    console.log(req.body);
    const student = await Student.findOne({ kerberos: req.body.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    const query = await Query.findOne({
      _id: req.params.id,
      student: student._id,
      status: "QUEUED",
    });
    if (!query) {
      res.status(400).send("Query not found");
      return;
    }
    await Query.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
//GET: /student/queries/queued?qid=&kerberos= - query of a student
queries_router.get("/queued", async (req, res) => {
  try {
    const student = await Student.findOne({ kerberos: req.query.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    const qid = req.query.qid;
    if (!qid) {
      res.status(400).send("Query ID not found");
      return;
    }
    const queries = await Query.find({
      student: student._id,
      _id: new ObjectId(qid),
      status: "QUEUED",
    });
    if (queries.length == 0) {
      res.status(400).send("Query not found");
      return;
    }
    res.status(200).send(queries[0]);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default queries_router;
