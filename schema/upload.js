var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var uploadSchema = new Schema({
    filename: {
        type: String,
        required: false,
        unique: false
    },
    fileurl: {
            type: String,
            required: false,
            unique: false
    },
    filetype:{
        type: String,
        required: false,
        unique: false  
    }
});

var Uploads = mongoose.model('uploadFile', uploadSchema);
module.exports = Uploads;
 