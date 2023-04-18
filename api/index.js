const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const { checkUser, requireAuth } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(credentials);
app.use(cors(corsOptions));

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
app.use('/api/post', postRoute);

// server - Listen toujours à la fin
app.listen(process.env.PORT, () => {
    console.log(`Backend is running on port ${process.env.PORT}`);
});