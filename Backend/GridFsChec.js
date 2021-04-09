// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');
// const Multer =require('./models/Multer')
// // const Multer = require('./')

// const app = express();
// mongoose.connect("mongodb+srv://priyesh:test1234@nodepratice.zmn1l.mongodb.net/CsvCrud?retryWrites=true", { useNewUrlParser: true, useUnifiedTopology: true, })
//     .then(result => {
//         console.log("Database Connected")

//     })
// // // Middleware
// // app.use(bodyParser.json());
// // app.use(methodOverride('_method'));

// // // Mongo URI
// // const mongoURI = 


// // // Create mongo connection
// // const conn = mongoose.createConnection(mongoURI);

// // // Init gfs
// // let gfs;

// // conn.once('open', () => {
// //     // Init stream
// //     gfs = Grid(conn.db, mongoose.mongo);
// //     gfs.collection('uploads');
// // });

// // // Create storage engine
// // const storage = new GridFsStorage({
// //     url: mongoURI,
// //     file: (req, file) => {
// //         return new Promise((resolve, reject) => {
// //             crypto.randomBytes(16, (err, buf) => {
// //                 if (err) {
// //                     return reject(err);
// //                 }
// //                 // const filename = buf.toString('hex') + path.extname(file.originalname);
// //                 const fileInfo = {
// //                     filename: file.originalname,
// //                     bucketName: 'uploads'
// //                 };
// //                 resolve(fileInfo);
// //             });
// //         });
// //     }
// // });
// // const upload = multer({ storage });

// // app.post('/dbupload', upload.single('file'), (req, res) => {
// //     console.log(req.file)
// //     res.json({ file: req.file });

// // });
// // app.get('/dbupload', (req, res) => {
// //     gfs.files.find().toArray((err, files) => {
// //         res.json({ files: files });
// //     })

// // })

// const storage = multer.diskStorage({
//     destination: './public/uploads',
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });


// const upload = multer({
//     storage: storage,

//     limits: {
//         fileSize: 104857600
//     }
// })


// router.post('/upload', upload.single('file'), async (req, res) => {
//     console.log(`POST request upload multer ${req.file.originalname}`);
//     console.log(req.file)
//     // var buf = Buffer.from(req.file)
//     // console.log(buf)
//     const newMulter = req.file;


//     await Multer.create(newMulter)
//         .then((resolve) => {
//             console.log(`STATUS :: Success`);
//             res.status(201).send({
//                 name: newMulter
//                 // name: newMulter.originalname,
//                 // mimetype: newMulter.mimetype,
//                 // path:newMulter.path
//                 // buffer: newMulter.buffer


//             });
//             // res.status(201).send("hello")
//         })
//         .catch((e) => {
//             console.error(`STATUS :: Ops.Something went wrong.`);
//             res.status(500).json({
//                 error: true,
//                 message: e.toString()
//             });
//         });
// });
// const port = 5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));