import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on('connected', ()=>console.log('Database Connected'))
    mongoose.connect(`${process.env.MONGODB_URI}/movie-ticket-booking`);
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDb
