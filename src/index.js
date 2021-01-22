const express = require('express')
require('./database/mongoose')
const app = express()

const User = require('./routers/user')
const Note = require('./routers/note')

app.use(express.json())
app.use(User)
app.use(Note)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is port ${PORT}`);
})