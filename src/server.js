require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const productsRouter = require('./routes/products')
app.use('/products', productsRouter)

const PORT = process.env.APP_PORT || 80
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`))