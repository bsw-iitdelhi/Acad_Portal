import express from 'express';
const router = express.Router();

import auth_router from "./auht.js"
router.use('/auth',auth_router);
import queries_router from './queries.js';
router.use('/queries', queries_router);
import attendance_router from './attendance.js';
router.use('/attendance', attendance_router);

export default router;
