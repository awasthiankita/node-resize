var express = require('express');
var router = express.Router();
const multer = require("multer");
var Uploads = require('../schema/upload');
const sharp = require('sharp');

var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'upload_image')
        },
        filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname)
        }

    })


var upload = multer({ storage: storage }).single("photo");


router.get('/callAPI', function (req, res, next) {
   
     res.json({ status: 200, hassuccessed: true })
          
});

//for upload the image 
router.post('/uploadimage', function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
        } else if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
        }
        else {
            var file_entry = { filename: res.req.file.filename, filetype: req.file.mimetype, url: res.req.file.destination + '/' + res.req.file.filename }
            var uploadsnew = new Uploads(file_entry);
            uploadsnew.save(function (err, added) {
                if (err){ res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err }) }
                res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
            });
           
        }
    });
});

//for getting the list of image
router.get('/allimage', function (req, res, next) {
    Uploads.find({}, function (err, allimages) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
        } else {
            res.json({status: 200, hassuccessed: true, data : allimages});
        }
    });
});

//for downloading the image
router.get('/downloadimage/:name', function (req, res, next) {
    const fileName = req.params.name;
    const width = parseInt(req.query.width);
    const height = parseInt(req.query.height);
    const directoryPath =  "upload_image/"+fileName

    const newImage = sharp(directoryPath).resize({ height: height, width: width }).toFile('new_image.jpg');
    newImage.then((data)=>{
        res.download('new_image.jpg', fileName, (err) => {
            if (err) {
              res.status(500).send({
                message: "Could not download the file. " + err,
              });
            }
    })
    }).catch((err)=>{
        console.log('err', err)
        res.json({status: 200, hassuccessed: false, msg  : 'issue comes on resizing the image in your given parameters'});
    })
  

});


module.exports = router;