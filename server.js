require('dotenv').config()
const express = require('express') // used to created server
const mongoose = require('mongoose') // used for connecting to mongodb database
const cors = require('cors') // used for connecting http to https and https to http
const fileUpload = require('express-fileupload') // used for uploading file on the current server
const cookieParser = require('cookie-parser') // used for parsing the cookie from server
const path = require('path') // used for getting path of any file exists in the current server


const app = express() // created a server
app.use(express.json()) 
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
    );
    next();
});


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) {
        console.log('Error Connection to MONGODB');
    };
    console.log('Connected to MongoDB')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// assigning port to the server
const PORT = process.env.PORT || 5001
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})