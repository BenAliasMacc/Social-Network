const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const { checkUser, requireAuth } = require('./middleware/auth');
const { logger } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const allowedOrigins = require('./config/allowedOrigins');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))) // Chemin pour upload

app.use(logger);

app.use(credentials);

app.use(cors())

/*Cross Origin Resource Sharing. système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, 
ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les oigines à utiliser l'api
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // type des différents header
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS', 'HEAD'); // méthodes
    next(); // méthode next permet à chaque middleware de passer l'exécution au middleware suivant
});

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

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
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);    
});