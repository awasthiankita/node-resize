var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var user = require('./schema/upload.js');
let router = express.Router();
var cors = require('cors')

mongoose.connect('mongodb://localhost/uploadImage', { useNewUrlParser: true });
mongoose.set('debug', true);

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var uploadFile    = require('./routes/uploadFile');

app.use('/newAPI', uploadFile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});


app.listen(5000, () => {
    console.log('Server started on port 5000');
});