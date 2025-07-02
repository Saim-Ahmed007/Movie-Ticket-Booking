import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import {serve} from 'inngest/express'
import { functions, inngest } from './inngest/index.js';
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express()
const port = 3000;

await connectDb()

//middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


//Api routes
app.get("/", (req,res) => {res.send('Server is running')})
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter)
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)


app.listen(port, ()=> {
    console.log(`server is listening from port ${port}`)
})