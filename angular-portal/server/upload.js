const IncomingForm = require('formidable').IncomingForm

const axios = require('axios')

var fs = require('fs');

module.exports = function upload(req, res) {
  var form = new IncomingForm()

  form.on('file', (field, file) => {
    var oldpath = file.path;
    var newpath = 'C:/Users/JDeCarvalho/Downloads/darkflow_trained/darkflow/images/' + file.name;
    try {
      fs.renameSync(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    } catch (error) {
      console.log('File upload failed')
      console.log(error)
    }

    console.log(file.path);
    console.log(file.name);
    axios.post('172.17.30.193:8090/predict_image', {
      filepath: newpath
    })
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })
      .catch((error) => {
        console.log("failed to post")
        console.error(error)
      })

  })
  form.on('end', () => {
    res.json()
  })
  form.parse(req)
}


