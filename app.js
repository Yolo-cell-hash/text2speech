const express = require('express');
const https = require('https');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

const api_key = "9aPvSu_r_kKsjKu9jJMJEtCoStkU0-t1wAUnrEjvbAao";
const api_url = "https://api.au-syd.speech-to-text.watson.cloud.ibm.com/instances/41dad866-1412-4184-96b7-b822e6b9df94";

app.get('/', function(req,res){
    res.render('home');
});

app.post('/', function(req,res){
    const speechToText = new SpeechToTextV1({
        authenticator: new IamAuthenticator({ apikey: api_key}),
        serviceUrl:api_url,
      });
      
      const params = {
        // From file
        audio: fs.createReadStream('./resources/speech.wav'),
        contentType: 'audio/l16; rate=44100'
      };
      
      speechToText.recognize(params)
        .then(response => {
          console.log(JSON.stringify(response.result, null, 2));
        })
        .catch(err => {
          console.log(err);
        });

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});