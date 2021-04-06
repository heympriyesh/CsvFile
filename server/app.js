const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const fs=require('fs');
const results=[];
const csv=require('csv-parser')
const csvRoutes=require('./routes/crudRoutes')
const cors=require('cors')
const Csvcrud=require('./models/Csvcrud')
dotenv.config();
// const corsOptions = {
//     exposedHeaders: 'auth-token',
// };
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const app=express();
app.use(cors())
app.use(express.json())
app.use(express.static('server'))

const port=7000;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true,})
.then(result=>{
    console.log("Database Connected")
    app.listen(port,()=>{
        console.log(`Server is up and running of port ${port}`)
    })
}).then((resu)=>{

    fs.createReadStream('details.csv')
    .pipe(csv({}))
    .on('data',(data)=>results.push(data))
    .on('end',()=>{

        // console.log(results)
    })
}

)

app.get('/',async (req,res)=>{
    try{

        await Csvcrud.create(results)
        res.send(results)
    }catch(err)
    {

    }

})

app.use(csvRoutes)
