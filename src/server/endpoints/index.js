import jwt from "jsonwebtoken";
import express from "express";
import Student from "../models/student.js";
import Token from "../models/token.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const router = express.Router();
const SECRET_KEY = "never-rely-on-secret-key-easy-to-hack";
//Authentication
//POST: /signup - Signup
router.post("/signup", async (req, res) => {
  const { kerberos, password, name, phone_number } = req.body;
  console.log(req.body);
  const existingStudent = await Student.findOne({ kerberos });
  if (existingStudent) {
    return res.status(400).json({ message: "Kerberos already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = new Student({
    kerberos,
    password: hashedPassword,
    name,
    phone_number,
  });
  await student.save();

  const token = jwt.sign({ id: student._id }, SECRET_KEY, {
    expiresIn: "423423h",
  });
  const authToken = new Token({
    userId: student._id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  await authToken.save();
  console.log(authToken);
  try {
    const link = `http://localhost:3001/api/verify/${authToken.token}`;
    await verifEmail(`${student.kerberos}@iitd.ac.in`, link); //
    res.status(201).json({
      message: "Please check your email to verify your account..",
      token,
    });
  } catch (err) {
    res.status(500).send({ message: "Error in sending email" });
    console.log(err);
  }
});

//POST: /login - Login
router.post("/login", async (req, res) => {
  const { kerberos, password } = req.body;

  const student = await Student.findOne({ kerberos });
  if (!student) {
    return res.status(400).json({ message: "Invalid kerberos or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, student.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid kerberos or password" });
  }
  if(student.verified === false)
  {
    const authToken = await Token.findOne({ userId: student._id });
    try {
      const link = `http://localhost:3001/api/verify/${authToken.token}`;
      await verifEmail(`${student.kerberos}@iitd.ac.in`, link);
      return res.status(201).json({
        message: "Please check your email to verify your account..",
        status: "unverified",
      });
    } catch (err) {
      return res.status(500).send({ message: "Error in sending email"});
    }
  }
  const token = jwt.sign({ id: student._id }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ message: "Logged in successfully", token ,status: "verified"});
});

router.get("/verify/:token", async (req, res) => {
  try{
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    // console.log(token);

    await Student.updateOne({ _id: token.userId }, {$set:{ verified: true }});
    const temp = await Student.findOne({ _id: token.userId });
    await Token.deleteOne(token._id);
    res.render("index.ejs",{
      first:temp.name,
    })
  }catch(err)
  {
    console.log(err);
  }

});

// router.use((req,res,next)=>{
//   const token = req.headers['x-access-token'];
//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }
//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     req.userId = decoded.id;
//     next();
//   });
// })

import student_router from "./students/index.js";
router.use("/student", student_router);

import mentor_router from "./mentor/index.js";
router.use("/mentor", mentor_router);

import moderator_router from "./moderator/index.js";
import verifEmail from "./oauth/emailverif.js";
router.use("/moderator", moderator_router);

export default router;
