const IncomingForm = require('formidable').IncomingForm

const axios = require('axios')


module.exports = function upload(req, res) {
  var form = new IncomingForm()

  form.on('file', (field, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    console.log(file.path);
    axios.post('localhost:8090/predict_image', {
      filepath: file.path
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


