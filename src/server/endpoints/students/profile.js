import express from "express";
import Student from "../../models/student.js";
import bcrypt from "bcryptjs";

const profile_router = express.Router();

//GET: /student/profile/:kerberos - Get student profile
profile_router.get("/:kerberos", async (req, res) => {
  try {
    const student = await Student.findOne({
      kerberos: req.params.kerberos,
    }).select("-password");
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    res.status(200).send(student);
  } catch (e) {
    res.status(500).send(e);
  }
});

//PUT: /student/profile/:kerberos - Update student profile
profile_router.put("/:kerberos", async (req, res) => {
  try {
    const student = await Student.findOne({ kerberos: req.params.kerberos });
    if (!student) {
      res.status(400).send("Student not found");
      return;
    }
    student.name = req.body.name;
    student.phone_number = req.body.phone_number;
    await student.save();
    res.status(200).send(student);
  } catch (e) {
    res.status(500).send(e);
  }
});

profile_router.post("/create", async (req, res) => {
  try {
    const student = new Student({
      kerberos: req.body.kerberos,
      password: req.body.password,
      name: req.body.name,
      phone_number: req.body.phone_number,
    });
    await student.save();
    res.status(201).send(student);
  } catch (e) {
    res.status(500).send(e);
  }
});

//POST: /student/profile/changePassword - Change student password
profile_router.post("/changePassword", async (req, res) => {
  try {
    const kerberos = req.body.kerberos;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await Student.findOne({ kerberos: kerberos });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (e) {
    res.status(500).send(e);
  }
});

export default profile_router;
