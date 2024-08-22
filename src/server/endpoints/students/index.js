import express from 'express';
import queries_router from './queries.js';
import profile_router from './profile.js';
const student_router = express.Router();
student_router.use('/queries', queries_router);
student_router.use('/profile', profile_router);
export default student_router;
