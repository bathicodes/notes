const express = require('express')
const auth = require('../middleware/auth')
const Note = require('../models/notes')
const router = express.Router()

//add note
router.post('/notes',auth,async(req,res) => {
    const note = new Note({
        ...req.body,
        owner: req.user._id
    })

    try {
        await note.save()
        res.status(201).send(note)
    } catch(e) {
        res.status(400).send(e.message)
    }
})

//get all notes
router.get('/notes/all',auth, async(req,res) => {
    try {
        const notes = await Note.find({owner: req.user._id})
        if(!notes){
            res.status(404).send()
        }
        res.send(notes)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

//get specific note
router.get('/notes/:id',auth,async(req,res) => {
    try {
        const note = await Note.findOne({_id: req.params.id, owner: req.user._id})
        if(!note){
            res.status(404).send()
        }
        res.send(note)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

//update note
router.patch('/notes/:id',auth,async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','description']
    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error: 'Invalid update'})
    }try {
        const note = await Note.findOne({_id: req.params.id, owner: req.user._id})
        if(!note) {
            res.status(404).send()
        }
        updates.forEach((update) => note[update] = req.body[update])
        await note.save()
        res.send(note)
    } catch(e) {
        res.status(500).send()
    }
})

//delete note
router.delete('/notes/:id',auth,async(req,res) => {
    try {
        const note = await Note.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!note){
            res.status(404).send()
        }
        res.send(note)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router