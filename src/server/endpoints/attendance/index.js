import express from 'express';
import Attendance from '../../models/attendance.js';
const attendanceRouter = express.Router();

attendanceRouter.post("/create",async (req,res)=>{
    try {
        let o=new Attendance({
            mentor:req.body.mentor,
           
            description:req.body.description,
            photo:req.body.photo,
            date:Date.now()
            
        })
        o=await o.save()
        res.status(200).send(o)
    } catch (error) {
        res.status(500).send(error)
    }
})