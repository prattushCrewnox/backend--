import app from './app.js';
import connectDB from './db/db.js';
import loadRoutes from './routes/index.route.js'

connectDB()
.then(() =>{
    app.on('error', (error) => {
        console.error('Error with: ', process.env.MONGODB_URI, error)
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server is running at port:", process.env.PORT || 8000)
    })
})
.catch(err => {
    console.log("mongoDB connection Failed", err)
})

loadRoutes(app)