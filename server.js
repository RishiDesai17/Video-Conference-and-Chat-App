const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get("/test", (req,res) => {
    res.send("hi")
})

app.listen(3001, () => {
    console.log("listening on 3001")
})