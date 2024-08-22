import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId, //reference to mentor
        ref: 'mentor',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true,
        default: Date.now
    },
    end: {
        type: Date,
        required: true
    },
    course: {
        type: String, // Assuming course code
        required: true
    },
    taker: {
        type: mongoose.Schema.Types.ObjectId, //reference to mentor
        ref: 'mentor',
        default: null
    },
    state: {
        type: String,
        enum:["AVAILABLE","TAKEN","EXPIRED"],
        default:"AVAILABLE"
    }
});

const Opportunity = mongoose.model('opportunity', opportunitySchema);

export default Opportunity;
