import axios from 'axios'
import Movie from './../models/movie.js';
import Show from '../models/show.js';

//Api to get now playing movies from TMDB api
export const getNowPlayingMovies = async(req,res) => {
    try {
       const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies = data.results
        res.json({success: true, movies: movies})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Api to add a new show to the database
export const addShow = async(req,res) => {
    try {
        const {movieId, showsInput, showPrice} = req.body
        let movie = await Movie.findById(movieId)
        if(!movie){
            //Fetch movie details and credits from TMDB api
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
                    headers: {Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: {Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
                })
            ])
            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data 

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieApiData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }
            //Add movie to the database
            movie = await Movie.create(movieDetails)
        }
        const showsToCreate = []
        showsInput.forEach(show => {
            const showDate = show.date
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        })
        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate)
        }
        res.json({success: true, message: "Show added successfully"})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//Api to get all shows from the database
export const getShows = async(req,res) => {
    try {
        const shows = await Show.find().populate('movie').sort({showDateTime: 1})
       
        //filter unigue shows
        const uniqueMoviesMap = new Map()
        shows.forEach(show => {
            const movieId = show.movie._id.toString();
             if (!uniqueMoviesMap.has(movieId)) {
                uniqueMoviesMap.set(movieId, show.movie);
    } 
        })
        // const uniqueShows = new Set(shows.map(show => show.movie))
        res.json({success: true, shows: Array.from(uniqueMoviesMap.values())})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Api to get a single show to the database
export const getShow = async(req,res) => {
    try {
        const {movieId} = req.params
        //get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId}) 
        const movie = await Movie.findById(movieId)
        const dateTime = {}
        shows.forEach((show)=>{
            const date = show.showDateTime.toISOString().split("T")[0]  
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({time: show.showDateTime, showId: show._id})
        }) 
        res.json({success: true, movie, dateTime})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
