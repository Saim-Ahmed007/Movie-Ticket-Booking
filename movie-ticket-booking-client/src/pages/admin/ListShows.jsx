import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { dateFormat } from './../../lib/dateFormat';
import BlurCircle from "../../components/BlurCircle";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user, getToken, axios} = useAppContext()

  const fetchShowData = async () => {
    try {
      const {data} = await axios.get("/api/admin/all-shows", {headers: {
            Authorization: `Bearer ${await getToken()}`
      }})
      if(data.success){
        setShows(data.shows)
      }else{
        toast.error(data.message)
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching dashboard data', error)
    }
  };
  useEffect(() => {
    if(user){
      fetchShowData();
    }
  }, [user]);
  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border border-collapse rounded-md overflow-hidden">
            <BlurCircle top="100px" left="200px"/>
            <thead>
                <tr className="bg-[#F84565]/20 text-left text-white">
                    <th className="p-2 font-medium pl-5">Movie Name</th>
                    <th className="p-2 font-medium">Show Time</th>
                    <th className="p-2 font-medium">Total Bookings</th>
                    <th className="p-2 font-medium">Earnings</th>
                </tr>
            </thead>
            <tbody className="text-sm font-light">
                {
                    shows.map((show, index) => (
                        <tr key={index} className="border-b border-[#F84565]/10 bg-[#F84565]/5
                         even:bg-[#F84565]/10">
                            <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                            <td className="p-2 ">{dateFormat(show.showDateTime)}</td>
                            <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                            <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
