const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000
const app = express()

connectDB()

app.use(express.json());
app.use(cors());


//app.use('/api/items', require('./routes/itemRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/inventory', require('./routes/inventoryRoutes'))


app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server up on ${port}`)
})