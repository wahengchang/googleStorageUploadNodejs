var express = require('express');

var formidable = require('formidable');
var gcloud = require('gcloud');
var fs = require('fs');
var cool = require('cool-ascii-faces');


var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.send("hello");
});
app.get('/upload', function(request, response) {
  response.status(200).sendFile(__dirname + "/views/upload.html");
});
app.get('/angularupload', function(request, response) {
  response.status(200).sendFile(__dirname + "/views/angularupload.html");
});


////////////////////////////////////////////////////////////////
////////////  part of upload to google storage   ///////////////
////////////////////////////////////////////////////////////////


var storage = gcloud.storage({
  keyFilename: 'google_key.json',
  projectId: 'projectId'
});

var bucketname='peterbucket';

app.post('/upload', function(req, res){

       var form = new formidable.IncomingForm();
       var downloadlink="";
       
       // parse a file upload
        form.parse(req, function(err, fieldst, files) {
          console.log('form.parse');
        });

        form.on('end', function(err,files) {
          console.log('end');
          // res.end("finished");

          res.json({code:0,downloadlink:downloadlink});
        });

         form.on('file', function(fields, files) {

                /* Temporary location of our uploaded file */
                var temp_path = files.path;
                /* The file name of the uploaded file */
                var file_name = files.name;
                /* The file going to upload*/
                var uploadedFile = files;


                /* bucket and file on google storage */
                var bucket = storage.bucket(bucketname);
                var file = bucket.file(file_name);
                downloadlink="https://storage.googleapis.com/"+bucketname+"/"+file_name;

                /***************** body ****************/

                var stream =fs.createReadStream(temp_path);

                stream.on('error', function(err){
                  console.log("error: "+err);
                });

                //upload and make public link
                bucket.upload(temp_path, {destination: file_name}, function(err, filet) {
                  console.log("upload successed:");
                  // console.log(filet);

                  filet.makePublic(function(err, api){
                    console.log("make public:"+JSON.stringify(err)+" \n"+JSON.stringify(api));
                  });
                });
         });
});

//streaming upload file to google storage from URL
app.get('/streamingtogoogle', function(req, res){

    var bucket = storage.bucket(bucketname);

    var remoteReadStream = bucket.file('filename').createReadStream();
    var remoteWriteStream = bucket.file('newfilename').createWriteStream();
    remoteReadStream.pipe(remoteWriteStream);

    remoteReadStream.on('error', function(err){
        console.log("error: "+err);
        res.json({downloadlink:err});
    });
    remoteReadStream.on('end', function(){
        console.log("finished: ");
        res.json({downloadlink:"finished"});
    });
});

//copying file to google storage to google storage
app.get('/copytogoogle', function(req, res){

    var bucket = storage.bucket(bucketname);

    var file = bucket.file('filename');
    file.copy('newfilename', function(err, copiedFile, apiResponse) {
      
      if(err){
        console.log("err");
        console.log(err);
        res.json({err:err});
      }
      else{
        console.log("copiedFile");
        console.log(copiedFile);
        res.json({code:0,downloadlink:"finished"});
      }
    });

});
////////////////////////////////////////////////////////////////
////////////  END of upload to google storage   ///////////////
////////////////////////////////////////////////////////////////


app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


