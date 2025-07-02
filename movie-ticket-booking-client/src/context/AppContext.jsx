import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AppContext = createContext()

export const AppProvider = ({children}) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favouriteMovies, setFavouriteMovies] = useState([])
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL
    const {user, isLoaded} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async() => {
        try {
            const {data} = await axios.get("/api/admin/is-admin", {headers: {
                Authorization: `Bearer ${await getToken()}`
            }})
            setIsAdmin(data.isAdmin)
            if(!data.isAdmin && location.pathname.startsWith("/admin")){
                navigate("/")
                toast("You are not authorized to access admin dashboard")
            }

        } catch (error) {
            console.error(error)
        }
    } 

    const fetchShows = async() => {
       try {
         const {data} = await axios.get("/api/show/all")
        if(data.success){
            setShows(data.shows)
        }else{
            toast(data.message)
        }
       } catch (error) {
        console.error(error)
       }
    }
    const fetchFavouriteMovies = async() => {
       try {
         const {data} = await axios.get("/api/user/favourites", {headers: {
                Authorization: `Bearer ${await getToken()}`
            }})
        if(data.success){
            setFavouriteMovies(data.movies)
        }else{
            toast(data.message)
        }
       } catch (error) {
        console.error(error)
       }
    }

    useEffect(()=> {
        fetchShows()
    },[])

    useEffect(()=> {
        if(isLoaded && user){
            fetchIsAdmin()
            fetchFavouriteMovies()
        }
    },[user, isLoaded])
    const value = {axios, fetchIsAdmin, user, getToken, navigate, isAdmin, shows, favouriteMovies, fetchFavouriteMovies, image_base_url, isLoaded}

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)