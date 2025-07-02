import express from 'express'
import { protectAdmin } from './../middleware/auth.js';
import { getAllBooking, getAllShows, getDashboardData, isAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router()
adminRouter.get("/is-admin", isAdmin)
adminRouter.get("/dashboard", getDashboardData)
adminRouter.get("/all-shows", getAllShows)
adminRouter.get("/all-bookings", getAllBooking)

export default adminRouter