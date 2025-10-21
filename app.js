import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import http from "http"
import cors from 'cors'
import Connect from './connection/conect.js'
import UserRouter from './Routes/userRoute.js'


const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use('/user',UserRouter)
Connect;

const PORT = process.env.PORT
server.listen(PORT,()=>{
    console.log("server running")
    console.log(`http://localhost:${PORT}`)
})
