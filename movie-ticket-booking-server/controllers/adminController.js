import { Booking } from './../models/booking.js';
import Show from './../models/show.js';
import { User } from './../models/user.js';

//Api to check if user is admin
export const isAdmin = async(req,res) => {
    res.json({success: true, isAdmin : true})
}

//Api to get dashboard data
export const getDashboardData = async(req,res) => {
    try {
        const bookings = await Booking.find({isPaid: true})
        const activeShows = await Show.find({}).populate('movie')
        const totalUser = await User.countDocuments()
        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount , 0),
            activeShows,
            totalUser
        }
        res.json({success: true, dashboardData})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//Api to get all shows
export const getAllShows = async(req,res) => {
    try {
        const shows = await Show.find({}).populate('movie').sort({showDateTime: 1})
         res.json({success: true, shows})
    } catch (error) {
       console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

//Api to get all Bookings
export const getAllBooking = async(req,res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',
            populate: {path: 'movie'}
        }).sort({createdAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}