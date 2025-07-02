import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "./../components/BlurCircle";
import { ArrowRightIcon, Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import { timeFormat } from './../lib/timeFormat';
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const {shows, image_base_url, axios, getToken, user, favouriteMovies, fetchFavouriteMovies} = useAppContext()

  const navigate = useNavigate()
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const getShow = async () => {
    try {
      const {data} = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleFavourite = async() => {
    try {
      if(!user) return toast.error('Please login to proceed')
      const {data} = await axios.post("/api/user/update-favourite", {movieId: id},
        {headers: {Authorization: `Bearer ${await getToken()}`}})
        if(data.success){
          await fetchFavouriteMovies()
          toast.success(data.message)
        }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
          src={image_base_url + show.movie.poster_path}
          alt=""
        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-[#F84565]">ENGLISH</p>
          <h1>{show.movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-[#F84565] fill-[#F84565]"/>
            <p>{show.movie.vote_average.toFixed(1)} IMDB Rating</p>
          </div>
          <p className="max-w-xl text-gray-400 mt-2 text-sm leading-tight">
            {show.movie.overview}
          </p>
          <p>{timeFormat(show.movie.runtime)} . {show.movie.genres.slice(0,2).map(genre => genre.name).join(" | ")} . {show.movie.release_date.split("-").join("/")}</p>

            <div className="flex items-center gap-4 flex-wrap mt-4">
                <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"> <PlayCircleIcon className="w-5 h-5"/> Watch Trailer</button>
                <a href="#dateSelect" className="px-10 py-3 text-sm bg-[#F84565] hover:bg-[#D63854] transition rounded-md font-medium cursor-pointer active:scale-95">Buy Tickets</a>
                <button onClick={handleFavourite} className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                    <Heart className={`w-5-h-5 ${favouriteMovies.find(movie => movie._id === id) ? 'fill-[#F84565] text-[#F84565]' : " "}`}/>
                </button>
            </div>
        </div>
      </div>
         <DateSelect  dateTime={show.dateTime} id={id}/>
         <div className="relative flex justify-between items-center pb-10 pt-30 ">
                <p className="text-gray-300 font-medium text-lg">You may also like</p>
                <button onClick={()=> navigate("/movies")} className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer">View All <ArrowRightIcon className="group-hover:translate-x-0.5 transition w-4.5 h-4.5"/>
                </button>
            </div>
            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {shows.slice(0,4).map((show) => (
                    <MovieCard key={show._id} movie={show}></MovieCard>
                ))}
            </div>
            <div className="flex justify-center mt-20">
                <button onClick={()=>{navigate("/movies"); scrollTo(0,0)}} className="px-10 py-3 text-sm bg-[#F84565] hover:bg-[#D63854] transition rounded-md font-medium cursor-pointer">Show more</button>
            </div>
    </div>
  ) : (
    <div><Loading/></div>
  );
};

export default MovieDetails;
