import { StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { timeFormat } from './../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({movie}) => {
    const navigate = useNavigate()
    const {image_base_url} = useAppContext()
    return (
        <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66 '>
            <img onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0,0)}} src={image_base_url + movie.backdrop_path} alt="" className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />
            <p className='font-semibold mt-2 truncate'>{movie.title}</p>
            <p className='text-sm text-gray-400 mt-2'>{new Date(movie.release_date).getFullYear()} -
                 {movie.genres.slice(0,2).map(genre => genre.name).join(" | ")} - {timeFormat(movie.runtime)}
            </p>
            <div className='flex justify-between items-center mt-4 pb-3'>
                <button onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0,0) }} className='px-4 py-2 text-xs bg-[#F84565] hover:bg-[#D63854] transition rounded-full font-medium cursor-pointer'>Buy Ticket</button>
                <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className='w-4 h-4 text-[#F84565] fill-[#F84565]'/>
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    );
};

export default MovieCard;