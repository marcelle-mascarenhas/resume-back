const express = require('express')
const cors = require('cors')

const { Pool } = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express()

app.use(express.json())
app.use(cors())


app.post('/stacks', async (req, res) => {
    const { name_stack } = req.body
    try {
        const stacks = await pool.query('INSERT INTO stacks(name_stack) VALUES ($1) RETURNING *', [name_stack])
        return res.status(200).send(stacks.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.get('/stacks', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM stacks')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }

})

app.patch('/stacks/:stack_id', async (req, res) => {
    const { stack_id } = req.params
    const data = req.body

    try {
        const updatedStack = await pool.query('UPDATE stacks SET name_stack = ($1) WHERE stack_id = ($2) RETURNING *', [data.name_stack, stack_id])
        return res.status(200).send(updatedStack.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.delete('/stacks/:stacks_id', async (req, res) => {
    const { stack_id } = req.params
    try {
        const deletedStack = await pool.query('DELETE FROM stacks WHERE stack_id = ($1) RETURNING *', [stack_id])
        return res.status(200).send({
            message: 'Stack deletada com sucesso',
            deletedProjetos: deletedStack.rows
        })

    } catch (err) { res.status(400).send(err) }
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

