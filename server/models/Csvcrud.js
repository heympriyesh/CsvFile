const mongoose = require('mongoose');
const { isEmail } = require('validator');
const csvSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
    },
    age:{
       type:Number,
       required:[true,"Please Select Your age"]

    },
    team:{
        type:String,
        required:[true,"Please Select your favourite team"]
    }

}, { timestamps: true })



csvSchema.pre('save', async function (next) {
    console.log("value of age",this.age);
    if(this.age<18)
    {
        throw Error("Age must be greater then 18")
    }else{
        next();
    }
    // const salt = await bcrypt.genSalt();
    // this.password = await bcrypt.hash(this.password, salt);
})

// csvSchema.post('save', function (error, doc, next) {
//     // console.log("Post Error", error)
//     if (error.name === 'MongoError' && error.code === 11000) {
//         next(new Error('There was a duplicate key error'));
//     } else {
//         next();
//     }
//     // next();
// // });
// csvSchema.post('save', function (error, res, next) {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         next(new Error('There was a duplicate key error'));
//     } else {
//         console.log('Error')
//         next();
//          // The `update()` call will still error out.
//     }
// });




const Csvcrud = mongoose.model('Csvcrud', csvSchema);

module.exports = Csvcrud;