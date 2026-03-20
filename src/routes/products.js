const router = require('express').Router()
const pool = require('../db/db')

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM products')
    res.json(result.rows)
})

router.post('/', async (req, res) => {
    const { name, price } = req.body
    const result = await pool.query('INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *', [name, price])
    res.json(result.rows[0])
})

module.exports = router