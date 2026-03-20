const router = require('express').Router()
const pool = require('../db/db')

// Validación completa para POST y PUT
const validateFull = (body) => {
    const { name, brand, category, stock, price, available } = body
    if (!name || !brand || !category) return 'name, brand y category son requeridos'
    if (stock === undefined || stock === null) return 'stock es requerido'
    if (price === undefined || price === null) return 'price es requerido'
    if (available === undefined || available === null) return 'available es requerido'
    if (!Number.isInteger(stock)) return 'stock debe ser entero'
    if (typeof price !== 'number') return 'price debe ser número decimal'
    if (typeof available !== 'boolean') return 'available debe ser booleano'
    return null
}

// GET /products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id')
        res.status(200).json(result.rows)
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
})

// GET /products/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener producto' })
    }
})

// POST /products
router.post('/', async (req, res) => {
    const error = validateFull(req.body)
    if (error) return res.status(400).json({ error })

    const { name, brand, category, stock, price, available } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO products (name, brand, category, stock, price, available) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [name, brand, category, stock, price, available]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Error al crear producto' })
    }
})

// PUT /products/:id
router.put('/:id', async (req, res) => {
    const error = validateFull(req.body)
    if (error) return res.status(400).json({ error })

    const { name, brand, category, stock, price, available } = req.body
    try {
        const result = await pool.query(
            'UPDATE products SET name=$1, brand=$2, category=$3, stock=$4, price=$5, available=$6 WHERE id=$7 RETURNING *',
            [name, brand, category, stock, price, available, req.params.id]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar producto' })
    }
})

// PATCH /products/:id
router.patch('/:id', async (req, res) => {
    const allowed = ['name', 'brand', 'category', 'stock', 'price', 'available']
    const fields = Object.keys(req.body).filter(k => allowed.includes(k))

    if (fields.length === 0) return res.status(400).json({ error: 'No hay campos válidos para actualizar' })

    // Validar tipos solo de los campos presentes
    const { stock, price, available } = req.body
    if (stock !== undefined && !Number.isInteger(stock))
        return res.status(400).json({ error: 'stock debe ser entero' })
    if (price !== undefined && typeof price !== 'number')
        return res.status(400).json({ error: 'price debe ser número decimal' })
    if (available !== undefined && typeof available !== 'boolean')
        return res.status(400).json({ error: 'available debe ser booleano' })

    // Construir query dinámicamente con solo los campos presentes
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ')
    const values = fields.map(f => req.body[f])
    values.push(req.params.id)

    try {
        const result = await pool.query(
            `UPDATE products SET ${setClause} WHERE id = $${values.length} RETURNING *`,
            values
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar producto' })
    }
})

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.status(200).json({ message: 'Producto eliminado' })
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar producto' })
    }
})

module.exports = router