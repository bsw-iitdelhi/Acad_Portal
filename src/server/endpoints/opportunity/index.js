import express from 'express';
import Opportunity from '../../models/opportunity.js';
const opportunityRouter = express.Router();

opportunityRouter.post("/create",async (req,res)=>{
    try {
        let o=new Opportunity({
            creator:req.body.creator,
            title:req.body.title,
            description:req.body.description,
            course:req.body.course,
            start:req.body.start,
            end:req.body.end
        })
        o=await o.save()
        res.status(200).send(o)
    } catch (error) {
        res.status(500).send(error)
    }
})
opportunityRouter.post("/update",async (req,res)=>{
    try {
        let oldOpp=await Opportunity.findById(req.body.id)
        
          
            oldOpp.title=req.body.title,
            oldOpp.description=req.body.description,
            oldOpp.course=req.body.course,
            oldOpp.start=req.body.start,
            oldOpp.end=req.body.end
        
            oldOpp=await oldOpp.save()
        res.status(200).send(oldOpp)
    } catch (error) {
        res.status(500).send(error)
    }
})

opportunityRouter.get("/",async (req,res)=>{
    try {
        const os=await Opportunity.find({})
        res.status(200).send(os)
    } catch (error) {
        res.status(500).send(error)
    }
})

opportunityRouter.get("/:id",async (req,res)=>{
    try {
        const o=await Feedback.findById(req.params.id)
        res.status(200).send(o)
    } catch (error) {
        res.status(500).send(error)
    }
})

opportunityRouter.post("/take",async (req,res)=>{
    try {
        let o=await Opportunity.findById(req.body.id)
        o.taker=req.body.taker
        o=await o.save()
        res.status(200).send(o)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default opportunityRouter