require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())

const productsRouter = require('./routes/products')
app.use('/products', productsRouter)

const PORT = process.env.APP_PORT || 80
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`))