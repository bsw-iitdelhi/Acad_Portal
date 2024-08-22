import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    student: {
        type:mongoose.Schema.Types.ObjectId,//reference to student
        ref: 'student',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    filled_at: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;
