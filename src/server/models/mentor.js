import mongoose from "mongoose"

const mentorSchema=mongoose.Schema({
    kerberos:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true, 
    },
    name:{
        type:String,
        required:true,
    },
    phone_number:{
        type:Number,
        required:true,
    },
    course:{
        type:String,
        required:true,
    },
    hours:{
        type:Number,
        required:true
    }
})

const Mentor=mongoose.model("mentor",mentorSchema)

export default Mentor;