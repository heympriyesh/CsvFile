const express = require('express');
const port = 9000;
const Multer = require('./models/Multer')
const mongoose=require('mongoose')
const multer = require('multer');
const dotenv=require('dotenv')
const path=require('path')
const cors = require('cors');
const { createSecretKey } = require('crypto');
const app = express();
dotenv.config();
app.use(cors())
app.use(express.static(__dirname + 'uploads'));
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(result => {
        console.log("Database Connected")

    })

var upload = multer({ dest: 'uploads/' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage })

app.post('/single', upload.single('profile'), async (req, res, error) => {
   console.log(req.file)
    try {
        console.log(req.file);
        await Multer.create(req.file);
        res.send(req.file);
    } catch (err) {
        res.send(400);
    }
});

app.use('/profile',express.static('uploads'));


app.get('/download/:id', async (req, res) => {
    console.log(req.params.id)
    const value= await Multer.findById({_id:req.params.id});

    const pathName=__dirname+`/${value.path}`;
    // console.log(pathName)
    // res.sendFile(pathName)
    res.json({
        url:`http://localhost:9000/profile/${value.originalname}`
    })
    // res.send('hello Guys');
});

app.get('/multerfile',async (req,res)=>{
    try{
        const value = await Multer.find({});
        // console.log(value);
        // console.log("ok");
        res.status(200).json(value)
    }catch(err)
    {
        console.log(err);
        res.status(400).json({err})
    }
    
})
app.listen(port, () => {
    console.log('listening to the port: ' + port);
});