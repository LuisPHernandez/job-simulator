const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.DB_PORT,
})

pool.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => {
        console.error('Error de conexión a la base de datos:', err.message)
        process.exit(1)
    })

module.exports = pool