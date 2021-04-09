const  Csvcrud =require( '../models/Csvcrud');
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
// const abc=require('../')
const fs = require('fs');
const csv = require('csv-parser')

const csvWriter=createCsvWriter({
    path:'download.csv',
    header:[
        {id:'name',title:'NAME'},
        {id:'email',title:'EMAIL'},
        {id:'age',title:'AGE'},
        {id:'team',title:'TEAM'}
    ]
})
var results = [];

module.exports.show_Data = async (req, res) => {
    try {
        const value = await Csvcrud.find()
        // console.log(value)
        res.status(200).json(value);
    } catch (err) {
        res.status(400).json(err)
    }

}
module.exports.add_Data = async (req, res) => {

    // console.log("name",req.body)
    // console.log("Email",req.body.email)
    const { name, email, age, team } = req.body;
    try {
        const value = await Csvcrud.create({ name, email, age, team });
        res.status(201).json({ value: value._id });
    } catch (err) {
        res.status(400).json({ err })
    }
}

module.exports.update_Data=async (req,res)=>{
    const { name, email, age, team } = req.body;
    if(!name|| !email || !age || !team)
    {
        return res.status(400).send("Field cannot be empty.")
    }
        try{
            const value = await Csvcrud.updateOne({ _id: req.params.id }, { $set: { name, email, age,team } })
            const user=await Csvcrud.findById({_id:req.params.id})
            res.status(200).json({user:user._id})
        }
        catch(err)
        {
            res.status(400).send(err)
        }
}

module.exports.download_Data=async (req,res)=>{
    try{
        const value= await Csvcrud.find();
        csvWriter.writeRecords(value)
        .then(()=>{
            res.download('./download.csv')
            // console.log('Done....')
        })
        // res.send(value)
    }catch(err)
    {
        res.status(400).json({err})
    }
}
module.exports.delete_Data = async (req, res) => {
    const id = req.params.id;
    // console.log("id",id)
    try {
        const value = await Csvcrud.deleteOne({ _id: id });
        // console.log(value)
        res.status(200).json(value);
    } catch (err) {
        res.status(400).json(err)
    }
}
var filename='';
module.exports.upload_File=async (req,res)=>{

    // console.log("The value from frnt", req.files)
    if (req.files) {
        // console.log("------------------", req.files)
        var file = req.files.file;
         filename = file.name;
        console.log(filename)
        if (!filename.match(/\.(csv)$/))
        {
            return res.status(400).send("Upload only .csv file...")
        }
        file.mv('./'+filename, function (err) {
            if (err) {
                res.status(400).send(err)
            } else {
                console.log("else checking")
            //  await fs.createReadStream(filename)
            //         .pipe(csv({}))
            //         .on('data', (data) => results.push(data))
            //         .on('end', () => {
            //             console.log("From validate Route", results)
            //         })
            //         console.log(results)
                res.send("File Uploaded..")
            }
        })
    }else{
        res.status(400).send("Upload th file first...")
    }
}

module.exports.validate_Data=async (req,res)=>{
    results=[];
    console.log("Filename",filename)
    try{
    fs.createReadStream(filename)
        .pipe(csv({}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.status(200).json(results)
        // data=results;
        })
    }
    catch(err)
    {
        res.status(400).send("Something went wrong..!")
    }
        // console.log("From validate Route",data)
        // console.log()
}   
module.exports.add_File_Details= async (req,res)=>{
    
    console.log("Checking the body",req.body)

    try{
      const csv=  await Csvcrud.create(req.body)
    //   console.log("Check it.",csv)
    res.status(200).send("created..")
    }catch(err){
            res.status(400).json({err})
    }
}