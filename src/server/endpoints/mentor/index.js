import express from 'express';

const mentor_router = express.Router();
import auth_router from './auth.js';
mentor_router.use('/auth', auth_router);
import queries_router from './queries.js';
mentor_router.use('/queries', queries_router);
import opportunity_router from './opportunity.js';
mentor_router.use('/opportunity', opportunity_router);
import attendance_router from './attendance.js';
mentor_router.use('/attendance', attendance_router);
export default mentor_router;