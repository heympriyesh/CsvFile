const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const fs=require('fs');
const results=[];
const csv=require('csv-parser')
const csvRoutes=require('./routes/crudRoutes')
const cors=require('cors')
const Csvcrud=require('./models/Csvcrud')
const fileUpload = require('express-fileupload');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
const multer = require("multer");
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');
const Multer=require('./models/Multer')
dotenv.config();

const app=express();
app.use(cors())
app.use(express.json())
// app.use(express.static('server'))
app.use(fileUpload());
// app.use(bodyParser.json());

// app.use(methodOverride('_method'));

const port=7000;
const mongoURI = process.env.DB_CONNECTION;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true,})
.then(result=>{
    console.log("Database Connected")
    
}).then((resu)=>{

    fs.createReadStream('details.csv')
    .pipe(csv({}))
    .on('data',(data)=>results.push(data))
    .on('end',()=>{

        // console.log(results)
    })
}

)

app.get('/create',async (req,res)=>{
    try{
        await Csvcrud.create(results)
        const find=await Csvcrud.find();
        res.status(200).json(find)
    }catch(err)
    {
        res.status(400).json({err}) 
    }
})



app.use(csvRoutes);

app.listen(port, () => {
    console.log(`Server is up and running of port ${port}`)
})