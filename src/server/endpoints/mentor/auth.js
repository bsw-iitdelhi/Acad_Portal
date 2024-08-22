import e from "express";
import Mentor from "../../models/mentor.js";
import bcrypt from 'bcryptjs';

const router = e.Router();

router.post("/register", async (req, res) => {
    const mentor = new Mentor({
        kerberos: req.body.kerberos,
        password: req.body.password,
        name: req.body.name,
        phone_number: req.body.phone_number,
        course: req.body.course,
        hours: req.body.hours,
    });
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        mentor.password = hashedPassword;
        console.log(mentor);
        await mentor.save();
        res.status(201).send(mentor);
    }
    catch(e){
        console.log(e);
    }
});
router.post("/login", async (req, res) => {
    try{
        const {kerberos, password} = req.body;
        const mentor = await Mentor.findOne({kerberos});
        if(!mentor)
        {
            return res.status(400).json({message: "Invalid kerberos or password"});
        }
        const isMatch = await bcrypt.compare(password, mentor.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Invalid kerberos or password"});
        }
        res.status(200).send(mentor);
    }catch(err)
    {
        console.log(err);
    }
});
router.get('/details/:kerberos',async(req,res)=>{
    try{
        // console.log(req.params);
        const mentor = await Mentor.findOne({kerberos: req.params.kerberos});
        if(!mentor){
            res.status(400).send("Mentor not found");
            return;
        }
        return res.status(200).send(mentor);
    }catch(er)
    {
        return res.status(400).send(er);
    }
}) 
router.post('/change-password',async(req,res)=>{
    try{
        const mentor = await Mentor.findOne({kerberos: req.body.kerberos});
        if(!mentor){
            res.status(400).send("Mentor not found");
            return;
        }
        const isMatch = await bcrypt.compare(req.body.oldPassword, mentor.password);
        if(!isMatch){
            res.status(400).send("Old password is incorrect");
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        mentor.password = hashedPassword;
        await mentor.save();
        res.status(200).send(mentor);

    }catch(er)
    {
        console.log(er);
    }
})
export default router;