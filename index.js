const express = require('express')
const mongoose = require('mongoose') // npm install mongoose
//const multer = require('multer')
const app = express()
// configuration - enable express to parse incoming json data 
app.use(express.json())
const port = 3055

 app.use(function(req, res, next) {
     console.log(`${req.method} - ${req.url} - ${req.ip} - ${new Date()}`)
     next()
 })

// establish connection to database
mongoose.connect('mongodb://localhost:27017/feb2020')
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('error connecting to db', err)
    })

// create a task schema 
const Schema = mongoose.Schema
const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'task should have a title']
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// create a model
const Task = mongoose.model('Task', taskSchema)

app.get('/', (req, res) => {
    res.send('Welcome to the website')
})

app.get('/api/error', (req, res) => {
    throw new Error('not authorized')
})

// tasks api 
app.get('/api/tasks', (req, res) => {
    Task.find()
        .then((tasks) => {
            res.json(tasks)
        })
        .catch((err) => {
            res.json(err)
        })
})

app.post('/api/tasks', (req, res) => {
    const body = req.body
    const task = new Task(body)
    task.save()
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

app.get('/api/tasks/:id', (req, res) => {
    const id = req.params.id 
    Task.findById(id)
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

app.put('/api/tasks/:id', (req, res) => {
    const id = req.params.id 
    const body = req.body 
    Task.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id 
    Task.findByIdAndUpdate(id)
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

 // error handling 
app.use(function(err, req, res, next){
    console.log('error handling middleware function')
    res.send(err.message)
})

// Sot Storage Engine
// const storage = multer.diskStorage({
//     destination: './public/uploads',
//     filename: function(req, file, cb){
//         cb(null, file, fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

// // Init Upload
// const upload = multer({
//     storage: storage,
//     limits: {fileSize: 10},
//     fileFilter: function(req, file, cb){
//         checkFileType(file, cb)
//     }
// }).single('myImage')

// // check file type
// function checkFileType(file, cb){

//     // Allowed ext
//     const filetypes = /jpeg|jpg|png|gif/

//     //check ext
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

//     // Check mime
//     const mimetype = filetypes.test(file.mimetype)

//     if(mimetype && extname){
//         return cb(null, true)
//     }else{
//         cb('Error: Images Only!')
//     }
// }

// // EJS
// app.set('view engine', 'ejs')

// //Public Folder
// app.use(express.static('./public'))

// app.get('/', (req, res) => {
//     res.render('app')
// })

// app.post('/upload', (req, res) => {
// upload(req, res, (err) => {
// if(err){
//     res.render('app', {
//         msg: err
//     })
// } else {
//     if(req.file == undefined){
//         res.render('app', {
//             msg: 'Error: No File Selected!'
//         })
//     }else{
//         res.render('app', {
//             msg: 'File Uploaded!',
//             file: `uploads/${req.file.filename}`
//         })
//     }
// }
// })
// })


app.listen(port, () => {
    console.log('server is running on port', port)
})