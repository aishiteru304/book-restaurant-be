import express from 'express'
import cors from 'cors'
import validator from 'validator'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import foodRouter from './routes/foodRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import tableRouter from './routes/tableRoute.js'
import reservationRouter from './routes/reservationRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import invoiceRouter from './routes/invoiceRoute.js'


//App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();


// middlewares
app.use(express.json())
app.use(cors())


// api endpoints
app.get(`/`, (req, res) => {
    res.send("API working")
})

app.use('/api/user', userRouter)
app.use('/api/food', foodRouter)
app.use('/api/review', reviewRouter)
app.use('/api/table', tableRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/invoice', invoiceRouter)



app.listen(port, () => console.log('server started on port : ' + port))