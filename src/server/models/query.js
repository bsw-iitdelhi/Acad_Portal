import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    type: {
        type: String,
        enum: ['General', 'APL100', 'CML101','APL100','ELL100','PYL101','COL100','MTL101','MTL100','MCP101','MCP100','PYP' /* Add other first-year courses */],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attachments: {
        type: [String], // Array of attachment URLs
        maxlength: 10 // Limiting to 10 attachments
    },
    raised_at: {
        type: Date,
        default: Date.now
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mentor',
        defult:null
    },
    taken_at: {
        type: Number,
        default:0
    },
    status: {
        type: String,
        enum: ['QUEUED', 'DISMISSED', 'AVAILABLE', 'TAKEN', 'RESOLVED', 'ACCEPTED', 'REJECTED'],
        default: 'QUEUED'
    },
    feedback: {
        type: String
    },
    resolved_at: {
        type: Date
    },
    last_action_moderator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moderator'
    },
    hours: {
        type: Number,
        default: 0
    }
});

const Query = mongoose.model('query', querySchema);

export default Query;
