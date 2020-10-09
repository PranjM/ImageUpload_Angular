const express = require('express')
const multer = require('multer');
var cors = require('cors');
var fileExtension = require('file-extension')

//CREATE EXPRESS APP
const app = express();

// cors allow usage of server from different origin only for development
app.use(cors())


//ROUTES WILL GO HERE
app.get('/', function (req, res) {
    res.json({ message: 'Server Started!' });
});

app.listen(3000, () => console.log('Server started on port 3000'));

var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'angular-upload-file-using-nodejs/src/assets')
          },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
    }
})
var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //Error 
            cb( new Error('Please upload JPG and PNG images only!'))
            return
        }
        //Success 
        cb(undefined, true)
    }
})
app.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
    const file = req.file
    console.log(req);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.status(200).send({
        statusCode: 200,
        status: 'success',
        uploadedFile: file
    })

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

