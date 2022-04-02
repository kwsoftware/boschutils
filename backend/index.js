const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = 5000

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/dailydiary', require('./routes/dailydiary'))
app.use('/api/spindlehistory', require('./routes/spindlehistory'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})