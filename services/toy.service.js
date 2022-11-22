const fs = require('fs')
const toys = require('../data/toy.json')

module.exports = {
    query,
    getById,
    remove,
    save,
}

function query(filterBy) {
    return Promise.resolve(_filterBy(filterBy))
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currtoy => currtoy._id === toy._id)
        toys[idx] = toy
    } else {
        toy._id = _makeId()
        toy.createdAt = new Date().getTime()
        toys.unshift(toy)
    }
    return _savetoysToFile().then(() => toy)
}

function getById(toyId) {
    const currtoy = toys.find(toy => toy._id === toyId)
    return new Promise((resolve, reject) => {
        if (currtoy < 0) reject('no toy with this id')
        else resolve(currtoy)
    })
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    toys.splice(idx, 1)
    return _savetoysToFile(toys).then(() => Promise.resolve(toyId))

}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _savetoysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)

        fs.writeFile('data/toy.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _filterBy(filterBy) {
    const toysToShow = toys.filter(toy => {
        //TODO: fix filterBy.inStock === 'false' to bool, it happens because of the request
        return toy.name.toLowerCase().includes(filterBy.name.toLowerCase())
            && filterBy.inStock === 'false' ? true : toy.inStock
        //filterBy.labels.length ? filterBy.labels.every(label => toy.labels.includes(label)) : true)
    })
    if (filterBy.sortBy) {
        const sortBy = filterBy.sortBy
        toysToShow.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1)
    }
    return toysToShow
}