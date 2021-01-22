const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/users')
const router = express.Router()

//user registration
router.post('/users/signup',async(req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch(e) {
        res.status(400).send(e.message)
    }
})

//user login
router.post('/users/login', async(req,res) => {
    try {
        const user = await User.findByCredintials(req.body.email, req.body.password)
        const token =  await user.generateAuthToken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//user logout
router.post('/users/logout',auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token = !token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

//logout from all the devices
router.post('/users/logoutall',auth,async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})


//get user profile
router.get('/users/me',auth,async(req,res) => {
    res.send(req.user)
})

//update user profile
router.patch('/users/me',auth,async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username','email','password']
    const isAllowed = updates.every((update) => allowedUpdates.includes(update))

    if(!isAllowed){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//delete user profile
router.delete('/users/me',auth,async(req,res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router