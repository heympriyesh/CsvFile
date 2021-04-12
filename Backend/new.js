const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const Document = require("../api/document/model/documentModel");
const DocumentLog = require("../api/document/model/documentHistory");
const DraftDocument = require("../api/document/model/draftModel");

const { addDocumentSchema } = require("./hapiJoi");
// const { resolve } = require("path");

// const methodOverride = require('method-override');
Grid.mongo = mongoose.mongo;
eval(
    `Grid.prototype.findOne = ${Grid.prototype.findOne
        .toString()
        .replace("nextObject", "next")}`
);

// Create mongo connection

// const conn = mongoose.createConnection(mongoURI, {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// });

// Init gfs
let gfs;

mongoose.connection.once("open", () => {
    // Init stream
    gfs = Grid(mongoose.connection.db);
    gfs.collection("upload");
    // console.log(gfs.files.find({}));
});
let mongoURI = process.env.MONGO_URI;

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    // db:mongoose.connection.th,
    // client:mongoose.connection,
    // file: (req, file) => {
    // return new Promise((resolve, reject) => {
    // crypto.randomBytes(16, (err, buf) => {
    // if (err) {
    // return reject(err);
    // }
    // // const filename = buf.toString('hex') + path.extname(file.originalname);
    // const filename = file.originalname;
    // const fileInfo = {
    // filename: filename,
    // bucketName: "upload",
    // };
    // resolve(fileInfo);
    // });
    // });
    // },

    file: (req, file) => ({
        filename: file.originalname,
        bucketName: "upload",
    }),
    cache: true,
});

function downloadFile(res, fileId) {
    return new Promise((resolve, reject) => {
        gfs.findOne({ _id: fileId || "5f9bf62562898965ac9b1fa8" }, function (
            err,
            file
        ) {
            if (err) {
                console.log(err);

                return reject(err);
            }
            // console.log(file);
            if (!file) {
                return reject("No file found")
            }
            let mimeType = file.contentType ? file.contentType : null;
            if (!mimeType) {
                mimeType = mime.lookup(file.filename);
            }

            // res.set("Content-Type", "application/pdf");
            let readstream = gfs.createReadStream({
                _id: fileId || "5f9bf62562898965ac9b1fa8",
            });
            readstream.on("error", function (err) {
                console.log("An error occurred!", err);
                reject(err);
            });

            readstream.on("end", function () {
                // console.log("An end occurred!");
                // reject(err);
                res.end();
            });

            // resolve(readstream.pipe(res));
            resolve((fileName) => {
                if (fileName) {
                    fileName = fileName + path.extname(file.filename);
                }
                res.set({
                    "Content-Length": file.length,
                    "Accept-Ranges": "bytes",
                    "Content-Type": mimeType,
                    "Content-Disposition":
                        "attachment; filename=" + (fileName || file.filename),
                });
                return readstream.pipe(res);
            });
        });
    });
}

const AddDocumentfileFilter = async (req, file, cb) => {
    const ext = [
        "text/csv",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
    ];

    if (ext.indexOf(file.mimetype.toLowerCase()) >= 0) {
        if (req.body.documentName && req.body.sharedWith) {
            if (req.body.sharedWith && typeof req.body.sharedWith == "string") {
                try {
                    req.body.sharedWith = JSON.parse(req.body.sharedWith);
                } catch (error) {
                    req.fileValidationError = "Error in parsing shared with";
                }
            }
            if (req.body.sharedWithOrganisation && typeof req.body.sharedWithOrganisation == "string") {
                try {
                    req.body.sharedWithOrganisation = JSON.parse(req.body.sharedWithOrganisation);
                } catch (error) {
                    req.fileValidationError = "Error in parsing sharedWithOrganisation";
                }
            }

            let { error } = addDocumentSchema.validate(req.body);
            console.log(error);

            if (req.fileValidationError || error) {
                req.fileValidationError =
                    req.fileValidationError || error.details[0].message;
                cb(new Error(req.fileValidationError));
            } else {
                const ins = await Document.findOne({
                    documentName: req.body.documentName,
                    createdBy: req.id
                });
                if (ins) {
                    req.fileValidationError = "Document with the same name already exist";
                    cb(new Error("Document with the same name already exist"));
                } else {
                    cb(null, true);
                }
            }
        } else {
            req.fileValidationError = "Please provide keys in valid order";
            cb(new Error("Please provide keys in valid order"));
        }
    } else {
        req.fileValidationError = "Please upload Image Only";
        cb(new Error("Please Upload Image in Valid Format"));
    }
};

const versionUpdatefileFilter = async (req, file, cb) => {
    const ext = [
        "text/csv",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
    ];

    if (ext.indexOf(file.mimetype.toLowerCase()) >= 0) {
        if (req.body.documentId) {
            const ins = await DocumentLog.findOne(
                {
                    documentId: req.body.documentId,
                    createdBy: req.id,
                },
                "versionName status"
            )
                .sort({
                    created_at: -1,
                })
                .lean(true);
            // console.log(ins);

            if (!ins || ins.status == "PENDING_REVIEW") {
                req.fileValidationError = ins
                    ? "The previous document is already in pending review status"
                    : "You are not authorized to upload";
                cb(new Error(req.fileValidationError));
            } else {
                req.body.versionName =
                    ins.status == "APPROVED" ? ins.versionName + 1 : ins.versionName;
                cb(null, true);
            }
        } else {
            req.fileValidationError = "Please provide keys in valid order";
            cb(new Error(req.fileValidationError));
        }
    } else {
        req.fileValidationError = "Please upload valid file Only";
        cb(new Error(req.fileValidationError));
    }
};
const deletefile = async (fileId) => {
    // console.log("ee1");
    var id = mongoose.Types.ObjectId(fileId);

    gfs.remove({ _id: id, root: "upload" }, (err) => {
        // console.log("sss2");

        if (err) console.log(err)
        // res.sendStatus(204)
    })
    // gfs.chunks.remove({ files_id: fileId }, (err) => {
    // console.log("sss3");

    // if (err) console.log(err)
    // // res.sendStatus(204)
    // })
};
// const fileDownload=async (req,res)=>{
// // console.log(gfs);
// var readstream =await gfs.createReadStream({ filename: req.body.Id });
// console.log(readstream);

// return readstream.pipe(res);
// // return gfs.uploads.chunks.find({ filename: req.body.Id }).toArray(function (err, files) {
// // if (err) return err
// // console.log(files,"hu");

// // return files;
// // });
// // console.log("last",ff);

// }

const AddDraftfileFilter = async (req, file, cb) => {
    const ext = [
        "text/csv",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
    ];

    if (ext.indexOf(file.mimetype.toLowerCase()) >= 0) {
        // if (req.body.documentName && req.body.sharedWith) {
        // if (req.body.sharedWith && typeof req.body.sharedWith == "string") {
        // try {
        // req.body.sharedWith = JSON.parse(req.body.sharedWith);
        // } catch (error) {
        // req.fileValidationError = "Error in parsing shared with";
        // }
        // }
        // if (req.body.sharedWithOrganisation && typeof req.body.sharedWithOrganisation == "string") {
        // try {
        // req.body.sharedWithOrganisation = JSON.parse(req.body.sharedWithOrganisation);
        // } catch (error) {
        // req.fileValidationError = "Error in parsing sharedWithOrganisation";
        // }
        // }


        // let { error } = addDocumentSchema.validate(req.body);
        // console.log(error);

        // if (req.fileValidationError || error) {
        // req.fileValidationError =
        // req.fileValidationError || error.details[0].message;
        // cb(new Error(req.fileValidationError));
        // } else {
        // const ins = await Document.findOne({
        // documentName: req.body.documentName,
        // createdBy:req.id
        // });
        // if (ins) {
        // req.fileValidationError = "Document with the same name already exist";
        // cb(new Error("Document with the same name already exist"));
        // } else {
        // cb(null, true);
        // }
        // }
        // } else {
        // req.fileValidationError = "Please provide keys in valid order";
        // cb(new Error("Please provide keys in valid order"));
        // }
        const ins = await DraftDocument.findOne({
            documentName: file.originalname,
            createdBy: req.id,
            isShifted: false
        });
        if (ins) {
            req.fileValidationError = "Document with the same name already exist";
            cb(new Error("Document with the same name already exist"));
        } else {
            cb(null, true);
        }

    } else {
        req.fileValidationError = "Please upload Image Only";
        cb(new Error("Please Upload Image in Valid Format"));
    }
};

module.exports = {
    addDocumentUpload: multer({
        storage,
        fileFilter: AddDocumentfileFilter,
        limits: {
            fileSize: 50 1024 1024,
        },
    }).single("file"),
    versionUpdateUpload: multer({
        storage,
        fileFilter: versionUpdatefileFilter,
        limits: {
            fileSize: 50 1024 1024,
        },
    }).single("file"),
    downloadFile,
    gfs,
    deletefile,
    addDraftUpload: multer({
        storage,
        fileFilter: AddDraftfileFilter,
        limits: {
            fileSize: 5 1024 1024,
        },
    }).single("file"),
};