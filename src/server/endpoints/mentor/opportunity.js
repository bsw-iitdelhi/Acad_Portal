import express from 'express';
import Mentor from '../../models/mentor.js';
import Opportunity from '../../models/opportunity.js';

const router=express.Router();


//GET: get all opportunities
router.get("/",async (req,res)=>{
    try{
        const opportunities=await Opportunity.find({state:"AVAILABLE"});
        res.status(200).send(opportunities);
        console.log(opportunities);
    }catch(e){
        res.status(500).send
    }
})

//POST: post a opportunity
router.post("/post",async (req,res)=>{
    const mentor=await Mentor.findOne({kerberos:req.body.kerberos});
    if(!mentor){
        res.status(400).send("Mentor not found");
    }
    const opportunity=new Opportunity({
        title:req.body.title,
        description:req.body.description,
        end:new Date(req.body.end),
        course:req.body.course,
        creator:mentor._id
    });
    await opportunity.save().then(()=>{
        res.status(201).send(opportunity);
    }).catch((e)=>{
        res.status(400);
        res.send(e);
    });
})

//PUT: edit the opportunity
router.put("/post/:id",async (req,res)=>{
    try{
        const opportunity=await Opportunity.findOne({_id:req.params.id});
        const mentor=await Mentor.findOne({kerberos:req.body.kerberos});
        if(!mentor){
            res.status(400).send("Mentor not found");
            return;
        }
        if(!opportunity){
            res.status(400).send("Opportunity not found");
            return;
        }
        if(mentor._id!==opportunity.creator){
            res.status(400).send("You are not the creator of this opportunity");
            return;
        }
        if(opportunity.state!=="AVAILABLE"){
            res.status(400).send("Opportunity not available");
            return;
        }
        opportunity.title=req.body.title;
        opportunity.description=req.body.description;
        opportunity.end=new Date(req.body.end);
        opportunity.course=req.body.course;
        await opportunity.save();
        res.status(200).send(opportunity);
    }catch(e){
        res.status(500).send(e);
    }
})

//DELETE: delete the opportunity
router.delete("/post/:id",async (req,res)=>{
    try{
        const opportunity=await Opportunity.findOne({_id:req.params.id});
        const mentor=await Mentor.findOne({kerberos:req.body.kerberos});
        if(!mentor){
            res.status(400).send("Mentor not found");
            return;
        }
        if(!opportunity){
            res.status(400).send("Opportunity not found");
            return;
        }
        if(mentor._id!==opportunity.creator){
            res.status(400).send("You are not the creator of this opportunity");
            return;
        }
        if(opportunity.state!=="AVAILABLE"){
            res.status(400).send("Opportunity not available");
            return;
        }
        await opportunity.remove();
        res.status(200).send(opportunity);
    }catch(e){
        res.status(500).send(e);
    }
})

//POST: Opportunity taken by mentor
router.post("/take/:id",async (req,res)=>{
    try{
        const opportunity=await Opportunity.findOne({_id:req.params.id});
        const mentor=await Mentor.findOne({kerberos:req.body.kerberos});
        if(!mentor){
            res.status(400).send("Mentor not found");
            return;
        }
        if(!opportunity){
            res.status(400).send("Opportunity not found");
            return;
        }
        if(mentor._id===opportunity.creator){
            res.status(400).send("You are the creator of this opportunity");
            return;
        }
        if(opportunity.state!=="AVAILABLE"){
            res.status(400).send("Opportunity not available");
            return;
        }
        if(opportunity.end.getTime() < Date.now()){
            opportunity.state = "EXPIRED";
            await opportunity.save();
            res.status(400).send("Expired");
            return;
        }
        opportunity.taker=mentor._id;
        opportunity.state="TAKEN";
        await opportunity.save();
        res.status(200).send(opportunity);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
})


export default router;