const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./authRouter');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/auth', authRoute);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://qwerty:qwerty123@cluster0.uquewvq.mongodb.net/auth_nodejs?retryWrites=true&w=majority')
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (e) {
        console.log(e)
    }
}

start();
