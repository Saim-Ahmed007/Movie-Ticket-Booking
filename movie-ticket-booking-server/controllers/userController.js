import { clerkClient, getAuth } from "@clerk/express"
import { Booking } from "../models/booking.js"
import Movie from "../models/movie.js"

//Api to get user booking
export const getUserBooking = async(req,res) => {
    try {
        const { userId } = getAuth(req)
        const bookings = await Booking.find({user}).populate('user').populate({
            path: 'show',
            populate : {path: 'movie'}
        }).sort({createdAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error.message)
        res.json({success: false, message: error.message})
    }
}

//Api to update favoutite movie in clerk user metadata 
export const updateFavourite = async(req,res) => {
    try {
        const {movieId} = req.body
        const {userId} = getAuth(req)
        console.log('user', userId)
        const user = await clerkClient.users.getUser(userId) 
        if(!user.privateMetadata.favourites){
            user.privateMetadata.favourites = []
        }
        if(!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId)  
        }else{
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter(item => item !== movieId)   
        }
        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})
        res.json({success: true, message: 'Favourite movies updated'})
    } catch (error) {
        console.error(error.message)
        res.json({success: false, message: error.message})
    }
}

//Api to get list of favourite movies
export const getFavourites = async(req,res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favoutites = user.privateMetadata.favourites
        //get all movies
        const movies = await Movie.find({_id: {$in: favoutites}})
        res.json({success: true, movies})
    } catch (error) {
         console.error(error.message)
        res.json({success: false, message: error.message})
    }
}