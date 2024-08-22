import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId:{
        type: String,
        ref: "student",
        required: true,
    },
    token:{
        type: String,
        required: true,
    },
});
export default mongoose.model('Token', schema);