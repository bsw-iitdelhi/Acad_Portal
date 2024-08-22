import express from 'express';
import Feedback from '../../models/feedback.js';
const feedbackRouter = express.Router();

feedbackRouter.post("/create",async (req,res)=>{
    try {
        let f=new Feedback({
            student:req.body.student,
            feedback:req.body.feedback,
            filled_at:Date.now()
        })
        f=await f.save()
        res.status(200).send(f)
    } catch (error) {
        res.status(500).send(error)
    }
})

feedbackRouter.get("/",async (req,res)=>{
    try {
        const fs=await Feedback.find({})
        res.status(200).send(fs)
    } catch (error) {
        res.status(500).send(error)
    }
})

feedbackRouter.get("/:id",async (req,res)=>{
    try {
        const f=await Feedback.findById(req.params.id)
        res.status(200).send(f)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default feedbackRouter