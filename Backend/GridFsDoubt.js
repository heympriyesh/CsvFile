const express=require('express');
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const dotenv = require('dotenv');
const crypto = require('crypto')
// const { app } = require('express');

const app=express();
dotenv.config();
app.use(express.json());

const mongoURI = process.env.DB_CONNECTION

// const conn = mongoose.createConnection(mongoURI,{useNewUrlParser:true,useUnifiedTopology:true});
Grid.mongo = mongoose.mongo;

eval(
    `Grid.prototype.findOne = ${Grid.prototype.findOne
        .toString()
        .replace("nextObject", "next")}`
);
// Init gfs
let gfs;
// const conn = mongoose.createConnection(mongoURI);

mongoose.connection.once('open', () => {
    // Init stream
    console.log("ooooooooooooooooooooooooooooooo");
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// mongoose.connection.once('open',()=>{
//     console.log("Just checking...");
//     gfs=Grid(conn.db,mongoose.mongo);
//     gfs.collection("upload")
// })

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                // const filename = buf.toString('hex') + path.extname(file.originalname);
                console.log("check", file)
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

app.post('/upload-doc', upload.single('file'), async (req, res) => {
    console.log("file", req.file)
    try {
        res.status(201).json({file:req.file})
    }   
    catch (err) {
        res.status(400).json({ err })
    }
    // res.redirect('/');
});


app.get('/files/:id', (req, res) => {
    gfs.findOne({ files_id: req.params.id }, (err, file) => {
        // Check if file
        console.log("The file value", file)
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});
app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});

app.get('/download/:filename', (req, res) => {
    console.log("filename", req.params.filename)
    gfs.findOne({ filename: req.params.filename }, function (err, file) {
        console.log("tjs ifel", file);
        if (err) {
            console.log("The Error in the download", err)
        }
        if (!file) {
            res.status(400).send("No file")
        }
        let readstream = gfs.createReadStream(
            { filename: req.params.filename }
        )
        readstream.on("error", function (err) {
            console.log("An error occured!", err);
        })
        readstream.on("end", function () {
            res.end()
        })
        let mimeType = file.contentType ? file.contentType : null;
        if (!mimeType) {
            mimeType = mime.lookup(file.filename);
        }
        res.set({
            "Content-Length": file.length,
            "Accept-Ranges": "bytes",
            "Content-Type": mimeType,
            "Content-Disposition":
                "attachment; filename=" + file.filename,
        })
        return readstream.pipe(res);
    })

})
module.exports = app;


app.listen(5000,()=>{
    console.log("Server is up and running on port 5000");
})