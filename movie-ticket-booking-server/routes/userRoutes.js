import express from 'express'
import { getFavourites, getUserBooking, updateFavourite } from '../controllers/userController.js'
import { requireAuth } from '@clerk/express'

const userRouter = express.Router()

userRouter.get("/bookings", getUserBooking)
userRouter.post("/update-favourite", updateFavourite)
userRouter.get("/favourites", getFavourites)

export default userRouter