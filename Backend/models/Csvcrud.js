const mongoose = require('mongoose');
const validator=require('validator')
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
    },
    image:{
        type:String,
        validate: {
            validator: value => validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
            message: 'Must be a Valid URL'
        }
    }

}, { timestamps: true })



csvSchema.pre('save', async function (next) {
    // console.log("value of age",this.age);
    if(this.team==='RCB')
    {
        this.image = 'https://wallpapercave.com/wp/wp4128487.jpg';
    }
    if (this.team === 'MI') {
        this.image = 'https://cdn.insidesport.co/wp-content/uploads/2021/02/17144436/MI-1.jpg';
    }
    if (this.team === 'PK') {
        this.image = 'https://wallpapercave.com/wp/wp4128487.jpg';
    }
    if (this.team === 'DC') {
        this.image = 'https://newsd.in/wp-content/uploads/2019/02/Delhi-Capitals-1024x576.jpg';
    }
    if (this.team === 'RR') {
        this.image = 'https://cdn.wionews.com/sites/default/files/styles/story_page/public/2018/09/12/39784-untitled%25252520design-15-20180128052841.jpg?itok=WjYncz3d';
    }
    if (this.team === 'SRH') {
        this.image = 'https://static.india.com/wp-content/uploads/2018/01/sun-1.jpg';
    }
    if (this.team === 'KKR') {
        this.image = 'https://cdn.insidesport.co/wp-content/uploads/2021/02/18132236/KKR.png';
    }
    if(this.team=== 'CSK')
    {
        this.image = "https://wallpapercave.com/wp/wp2496943.jpg"
    }
    next();
})


csvSchema.post('save', function (doc) {
    console.log('%s has been saved', doc._id);
});
csvSchema.post('remove', function (doc) {
    console.log('%s has been removed', doc._id);
});
const Csvcrud = mongoose.model('Csvcrud', csvSchema);

module.exports = Csvcrud;