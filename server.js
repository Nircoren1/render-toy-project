const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const toyService = require('./services/toy.service')

const app = express()

app.use(express.static('public'))

app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
    ],
    credentials: true,
}
app.use(cors(corsOptions))


app.get('/api/toy', (req, res) => {
    toyService.query(req.query)
        .then(toys => {
            res.send(toys)
        })
})

app.get('/api/toy/:toyId', (req, res) => {
    toyService.getById(req.params.toyId).then(toy => res.send(toy)).catch((err) => res.send(err))
})

app.post('/api/toy/', (req, res) => {
    const { name, price, labels, inStock } = req.body
    const toy = {
        name,
        price,
        labels,
        inStock
    }
    toyService.save(toy).then(savedtoy => res.send(savedtoy))
})

app.put('/api/toy/:toyId', (req, res) => {
    const { _id, name, price, labels, inStock } = req.body
    const toy = {
        _id,
        name,
        price,
        labels,
        inStock
    }
    toyService.save(toy).then(savedtoy => res.send(savedtoy))
})

app.delete('/api/toy/:toyId/', (req, res) => {
    toyService.remove(req.params.toyId).then(toyId => res.send(`toy ${toyId} was deleted.`))
})

// const port = 
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});