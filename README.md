# googleStorageUploadNodejs

It is a project of uploading file to google storage by <br />
1. -html form multipart <br />
2. -angularjs upload directive, controller and $http.post <br />

1. Visit the Google Developer Console
2. Click credentials
3. Create new client ID
4. Create a service account, then generate new JSON key and download the JSON key file.
⋅⋅* Put the JSON key in the root folder, as showed of google_key.json
5. npm install
```javascript
//index.js replace your keyFilename and projectId

var storage = gcloud.storage({
  keyFilename: 'google_key.json',
  projectId: 'projectId'
});
```

6. npm start
7. localhost:5000/upload
8. localhost:5000/angularupload

```javascript
//result when upload success

{
code: 0,
downloadlink: "https://storage.googleapis.com/bucket/upload.file"
}
```


[Google offical tutorial](https://github.com/GoogleCloudPlatform/gcloud-node)

[Gogole storage nodejs Example](https://cloud.google.com/nodejs/)

[Angularjs Multipart Example by Jenny Louthan](https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs)



