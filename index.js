const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

mongoose.Promise = global.Promise

const contactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true}
})

const contacts = mongoose.model('list', contactSchema)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    contacts.find({}, (err, data) => {
        res.json({
            success: true,
            contacts: data
        })        
    })
})

app.post('/', (req, res) => {
    const contact = new contacts(req.body)
    contact.save(err => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'Contact was not saved!'
            })
        }
        res.json({
            success: true,
            contact
        })
    })
})

app.put('/:_id', (req, res) => {
    const {_id} = req.params
    const contact = req.body
    contacts.findByIdAndUpdate(_id, contact, (err) => {
        if (err){
            return res.status(400).json({
                success: false,
                message: 'Contact was not updated!'
            })
        }
        res.json({
            success: true,
            contact
        })
    })
})

app.delete('/:_id', (req, res) => {
    const {_id} = req.params
    contacts.findByIdAndDelete(_id, (err, doc) => {
        if (err || !doc) {
            return res.status(400).json({
                success: false,
                message: 'Id not found, contact wont be removed!'
            })
        }
        res.json({
            success: true,
            message: `${_id} removed!`
        })
    })
})

mongoose.connect('mongodb://localhost/contacts', { useUnifiedTopology: true } )
    .then(() => {
        app.listen(4000, (err) => {
            if (err) {
                    return console.log('Error: ', err)
                }
                console.log('No Error!')
            } )
        })
    .catch(err => console.log(err))



