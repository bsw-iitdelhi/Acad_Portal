import mongoose from "mongoose"

const modSchema=mongoose.Schema({
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
    }
})

const Moderator=mongoose.model("moderator",modSchema)

export default Moderator;