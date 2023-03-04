const express = require('express');
const https = require('https');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const sound = require("sound-play");
const path = require("path");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

var input_text='';

app.get('/', function(req,res){
    res.render('home');
});

app.post('/',function(req,res){

    input_text=req.body.en_txt;

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({ apikey: 'XUKfSiyFxV8aWiNTCUJzLg24IMm77YRDvKYuOVgxqf_z' }),
  serviceUrl: 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/71f2f6c4-3431-400e-aa87-bb73c54a6a86'
});

if(input_text.length===0){
  const params = {
    text:'Bro you fucking stupid, because you did not enter any text. Now, casue of you I gotta waste one API call to let you know about this. Try being smart bozo!',
    voice: 'en-US_AllisonVoice',
    accept: 'audio/wav'
  };
  
  textToSpeech
    .synthesize(params)
    .then(response => {
      const audio = response.result;
      return textToSpeech.repairWavHeaderStream(audio);
    })
    .then(repairedFile => {
      fs.writeFileSync('audio.wav', repairedFile);
      console.log('audio.wav written with a corrected wav header');
      res.redirect('/');
      const filePath = path.join(__dirname, "audio.wav");
      sound.play(filePath);
    })
    .catch(err => {
      console.log(err);
    }); 
}
else{
    const params = {
        text:input_text,
        voice: 'en-US_AllisonVoice',
        accept: 'audio/wav'
      };
      
      textToSpeech
        .synthesize(params)
        .then(response => {
          const audio = response.result;
          return textToSpeech.repairWavHeaderStream(audio);
        })
        .then(repairedFile => {
          fs.writeFileSync('audio.wav', repairedFile);
          console.log('audio.wav written with a corrected wav header');
          res.redirect('/');
          const filePath = path.join(__dirname, "audio.wav");
          sound.play(filePath);
        })
        .catch(err => {
          console.log(err);
        });  
}
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});