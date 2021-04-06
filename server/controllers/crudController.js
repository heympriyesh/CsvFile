const  Csvcrud =require( '../models/Csvcrud');
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
// const abc=require('../download.csv')
const csvWriter=createCsvWriter({
    path:'download.csv',
    header:[
        {id:'name',title:'NAME'},
        {id:'email',title:'EMAIL'},
        {id:'age',title:'AGE'},
        {id:'team',title:'TEAM'}
    ]
})

module.exports.show_Data = async (req, res) => {
    try {
        const value = await Csvcrud.find()
        console.log(value)
        res.status(200).json(value);
    } catch (err) {
        res.status(400).json(err)
    }

}
module.exports.add_Data = async (req, res) => {

    const { name, email, age, team } = req.body;
    try {
        const value = await Csvcrud.create({ name, email, age, team });
        // const drop = await Category.find();
        res.status(201).json({ value: value._id });
        console.log("Done")
        console.log("Created... sucess")
        res.status(201).send("created..")
    } catch (err) {
        // res.send(err)
        res.status(400).json({ err })
        // res.status(400).send()

    }
}

module.exports.update_Data=async (req,res)=>{
    const { name, email, age, team } = req.body;
        try{
            const value = await Csvcrud.updateOne({ _id: req.params.id }, { $set: { name, email, age, team } })
            const user=await Csvcrud.findById({_id:req.params.id})
            res.status(200).json({user:user._id})
        }
        catch(err)
        {
            // console.log(err)
            res.status(400).send({ err })
        }
}

module.exports.download_Data=async (req,res)=>{
    try{
        const value= await Csvcrud.find();
        csvWriter.writeRecords(value)
        .then(()=>{
            res.download('./download.csv')
            console.log('Done....')
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
        console.log(value)
        res.status(200).json(value);
    } catch (err) {
        res.status(400).json(err)
    }
}