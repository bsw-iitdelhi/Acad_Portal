import mongoose from "mongoose"

const studentSchema=mongoose.Schema({
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
    verified:{
        type:Boolean,
        default:false,
    },
})

const Student=mongoose.model("student",studentSchema)

export default Student;