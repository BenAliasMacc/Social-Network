const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const { checkUser, requireAuth } = require('./middleware/auth');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log('connection à mongoDB réussi')).catch((err)=>console.log(err));

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);


// server - Listen toujours à la fin
app.listen(process.env.PORT, () => {
    console.log(`Backend is running on port ${process.env.PORT}`);    
});