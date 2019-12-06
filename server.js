const path = require('path')
const express = require('express')
const app = express()

const port = 8080
const baseUrl = process.env.BASE_URL || '/'

app.use(baseUrl, express.static(path.join(__dirname, 'www')))

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Serving GainsTrack at http://localhost:${port}${baseUrl}`))
