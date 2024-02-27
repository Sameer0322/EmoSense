import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

const saltRounds = 10

dotenv.config({ path: './../../../.env' });

const app = express()
const port = 3000
mongoose.connect(process.env.MONGODB_URI + 'EA')

const TeacherSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String, 
    }
})

const Teacher = mongoose.model('Teacher', TeacherSchema)

app.use(express.static('public'))
app.use(bodyParser.json({ extended: true }))
app.use(cors())

app.post('/register', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const name = req.body.name

    const searchResult = await Teacher.find({ username: username })
    if(searchResult.length > 0) {
        res.json( { ok : false, message: 'User Already Exists'})
    }
    else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                res.json({ ok: false, message: 'Something went wrong. Please try again' })
            } else {
                const newTeacher = new Teacher({
                  password: hash,
                  name: name,
                  username: username 
                })
    
                newTeacher.save()
                res.json({ ok: true, message: 'Successfully registered' })
            }
        })
    }


})

app.post('/login', async (req, res) => {
    const username  = req.body.username
    const password = req.body.password

    const teacher = await Teacher.findOne({ username: username }) 

    if (teacher) {
        bcrypt.compare(password, teacher.password, function (err, result) {
            if(err) {
                res.json({ ok: false, message: 'Something went wrong. Please try agin' })
            } else {
                if(result === true) {
                    res.json({ ok: true, message: 'Login successful' })
                } else {
                    res.json({ ok: false, message: 'Invalid username or password' })
                }
            }
        })
    }    
})

app.listen(port, () => {
console.log(`listening on localhost:${port}`);
})