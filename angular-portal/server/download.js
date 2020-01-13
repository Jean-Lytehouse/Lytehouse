const IncomingForm = require('formidable').IncomingForm

const axios = require('axios')

var fs = require('fs');

module.exports = function download(req, res) {
  const detectionsFolder = 'C:/Users/JDeCarvalho/Downloads/darkflow_trained/darkflow/detections';
  const fs = require('fs');

  fs.readdir(detectionsFolder, (err, files) => {
    files.forEach(file => {
      console.log(file); // use those file and return it as a REST API
    });
  })
}


