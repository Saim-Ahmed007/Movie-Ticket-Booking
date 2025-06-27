import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "./../assets/assets";
import Loading from "./../components/Loading";
import { ArrowRight, ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import { toast } from 'react-hot-toast';

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const { date, id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData,
      });
    }
  };
  
  const handleSeatClick = (seatId) => {
    if(!selectedTime){
      return toast("Please select time first")
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length >= 5){
      return toast("You can only select 5 seats")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }
  const handleProceedToCheckout = () => {
    if(!selectedTime){
      return toast("Please select time first")
    }
    if(selectedSeats.length === 0){
      return toast("Please select seat before checkout")
    }
    navigate("/my-bookings")
  }
  

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-[#F84565]/60 cursor-pointer ${
                selectedSeats.includes(seatId) && "bg-[#F84565] text-white"
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
  }, [id]);
  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50 ">
      {/* available timings */}
      <div className="w-60 bg-[#F84565]/10 border border-[#F84565]/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold mb-5 px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition    ${
                selectedTime?.time === item.time
                  ? "bg-[#F84565] text-white"
                  : "hover:bg-[#F84565]/20"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">
                {new Date(item.time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" "}
                PM
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* seat layout */}
      <div className="flex flex-1 relative flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="-100px" right="0" />
        <h1 className="text-2xl font-semibold mb-4">Select You Seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-sm mb-6 text-gray-400">SCREEN SIDE</p>
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map(row => renderSeats(row))}
          </div>
           <div className="grid grid-cols-2 gap-11">
          {groupRows.slice(1).map((group, index) => (
            <div key={index}>
              {group.map(row => renderSeats(row))}
            </div>
          ))}
        </div>
        </div>
        <button onClick={handleProceedToCheckout} className="flex items-center gap-2 mt-20 bg-[#F84565] hover:bg-[#D63854] text-sm px-10 py-3 rounded-full cursor-pointer font-medium active:scale-95">Proceed to checkout <ArrowRight strokeWidth={3} className="w-4 h-4"/></button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
