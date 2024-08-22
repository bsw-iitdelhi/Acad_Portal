import express from "express";
import Moderator from "../../models/moderator.js";
import Attendance from "../../models/attendance.js";

const router = express.Router();

//GET: get all attendance
router.get("/", async (req, res) => {
  try {
    const moderator = await Moderator.findOne({ kerberos: req.body.kerberos });
    if (!moderator) {
      res.status(400).send("Moderator not found");
      return;
    }
    const attendances = await Attendance.find({ moderator: moderator._id });
    res.status(200).send(attendances);
  } catch (e) {
    res.status(500).send;
  }
});

//PUT: approves the attendance
router.get("/approve/:id", async (req, res) => {
    try{
        const attendance=await Attendance.findOne({_id:req.params.id});
        const moderator=await Moderator.findOne({kerberos:req.body.kerberos});
        if(!moderator){
            res.status(400).send("Moderator not found");
            return;
        }
        if(!attendance){
            res.status(400).send("Attendance not found");
            return;
        }
        attendance.approved_by=moderator._id;
        attendance.hours=req.body.hours;
        await attendance.save();
    }
    catch(e){
        res.status(500).send(e);
    }
});

//PUT: disapproves the attendance
router.get("/disapprove/:id", async (req, res) => {
    try{
        const attendance=await Attendance.findOne({_id:req.params.id});
        const moderator=await Moderator.findOne({kerberos:req.body.kerberos});
        if(!moderator){
            res.status(400).send("Moderator not found");
            return;
        }
        if(!attendance){
            res.status(400).send("Attendance not found");
            return;
        }
        attendance.disapproved_by=moderator._id;
        attendance.hours=0;
        await attendance.save();
    }
    catch(e){
        res.status(500).send(e);
    }
});

export default router;