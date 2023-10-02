const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const Cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api")

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
    console.log('Database connected...');
}) 
const Option = { origin: "*", methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], Credentials: true}

// middleware
app.use(express.json());
app.use(Cors(Option));
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

// router
app.use(authRouter);
app.use(apiRouter);


app.listen(8800,()=>{
    console.log("Connection successfull...");
})


// const express = require("express");
// const fs = require('fs');
// const path = require('path');
// const Mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// const helmet = require('helmet');

// dotenv.config();

// const userRoute = require('./routes/user')
// const postRoute = require('./routes/post')
// const authRoute = require('./routes/auth')

// const app = express();

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags : 'a'})

// app.use(express.json());
// app.use(helmet());
// app.use(morgan('combined', {stream : accessLogStream}));

// //all the working middlewares from this point;
// app.use('/api/users', userRoute);
// app.use('/api/posts', postRoute);
// app.use('/api/auth', authRoute);

// Mongoose.connect(process.env.MONGO_URL).then(()=>{
//     console.log('connected to mongoDB');
//     app.listen(8800);
// })