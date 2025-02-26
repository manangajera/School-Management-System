import http from "http"
import app from "./app.js"

const port = process.env.PORT
const server = http.createServer(app)

server.listen(port,()=>{
    console.log("App is running on port ",port)
})