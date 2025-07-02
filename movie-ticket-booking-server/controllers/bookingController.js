import { Booking } from '../models/booking.js';
import Show from './../models/show.js';
import { getAuth } from '@clerk/express';
//Function to check availability of selected seats for a movie
export const checkSeatsAvailability = async(showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if(!showId) return false
        const occupiedSeats = showData.occupiedSeats
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])
        return !isAnySeatTaken
    } catch (error) {
        console.error(error.message)
        return false
    }
}
export const createBooking = async(req,res) => {
    try {
    const {userId} = getAuth(req)
    console.log("userId from req.auth:", userId); 
    const {showId, selectedSeats} = req.body;
    const {origin} = req.headers
    //check if the seats is available for the selected show
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats)
    if(!isAvailable){
        return res.json({success: false, message: "Selected seats are not available"})
    }
    // get show details
    const showData = await Show.findById(showId).populate('movie')
    //create new booking
    const booking = await Booking.create({
        user: userId,
        show: showId,
        amount : showData.showPrice * selectedSeats.length,
        bookedSeats: selectedSeats
    })
    selectedSeats.map((seat) => {
        showData.occupiedSeats[seat] = userId
    })
    showData.markModified('occupiedSeats')
    await showData.save()

    //stripe gateway initilize

    res.json({success: true, message: 'Booked successfully'})
   
    } catch (error) {
        console.log(error.message)
     res.json({success: false, message: error.message})   
    } 
}

export const getOccupiedSeats = async(req,res) => {
    try {
        const {showId} = req.params
        const showData = await Show.findById(showId)
        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({success: true, occupiedSeats})
        
    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}