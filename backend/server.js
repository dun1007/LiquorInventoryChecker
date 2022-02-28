const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000
const app = express()
const path = require('path')
const cors = require('cors')

connectDB()

app.use(express.json());
app.use(cors());


app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/inventory', require('./routes/inventoryRoutes'))
app.use('/api/weekly', require('./routes/weeklyRoutes'))

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))
  
    app.get('*', (req, res) =>
      res.sendFile(
        path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
      )
    )
  } else {
    app.get('/', (req, res) => res.send('Please set to production'))
  }
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server up on ${port}`)
})