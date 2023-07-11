var express=require("express");
var bodyParser=require("body-parser");
var nodemailer = require("nodemailer")
const mongoose = require('mongoose');
const fs = require('fs')
const { google } = require('googleapis')

mongoose.connect('mongodb+srv://ANDAL:3eUG4zYhdXD8Ub1D@mycluster.umojeuk.mongodb.net/ConstructionCompany');

require("dotenv").config()
const nodeMailer = require('nodemailer');
const { rmSync } = require("fs");
var app=express()

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: true
})); 




const GOOGLE_API_FOLDER_ID = '1hZcaJok2aQgshsnqt6tvX7edrXmRQylM'

app.post("/uploadpic", async (req, res) => {
   
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: './drivejason.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': req.body.file,
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(req.body.file)
        }
       //console.log(req.body.file)
        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        res.redirect("imagesuccess.html")
        //return response.data.id
        
    }catch(err){
        console.log('Upload file error', err)
    }
    
})




 

  
  app.get("/sendmail", (req, res) => {
    res.redirect("package");
  });
  
  app.post("/sendmail", async (req, res) => {
    const { name, mail, pack } = req.body;
    try {
      
      var transporter = nodemailer.createTransport({
         service:'gmail',
         auth:{
            user:'124003029@sastra.ac.in',
            pass:'9344062405'
         }
        })
      
        var mailOptions = {
         from:'124003029@sastra.ac.in',
         to:mail,
         subject:"Sivan Constructions",
         text:"Hello, " + name +" "+ "\n\nThanks for selecting package" +" "+ pack+"\n\n"+" "+
              "\nOur officials will contact you through mobile to confirm the package"+
              "\nThen we will send you gmeet link for closer interaction"+
              "\nOnce contract is confirmed day to day construction images will uploaded with date as (date.jpg) in the following drive"+
              "\nYou can also upload images as (yourname.jpg) and let us know your dream home's imaginary pics\n\n\n"+
              "This drive will acts as shared buffer between you and us to share thoughts as images\n\n\n"+
              "https://drive.google.com/drive/u/1/folders/1hZcaJok2aQgshsnqt6tvX7edrXmRQylM"+
              "\n\n Best wishes from team of Sivan Constructions,"+
              "\n Thank you."
         //html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer'
        }

        transporter.sendMail(mailOptions,function(err,info){
         if(err){
            console.log(err)
         }else{
            console.log("Email sent" + info.response)
         }
        })
     
      res.redirect("packagesuccess.html")
      //res.send("Message sent! Package: " + pack);
    } catch (error) {
      res.send("Message Could not be Sent");
    }
  });
  
  
  

const accountSchema = {
   name : String,
   pass : String,
   email : String,
   phone : Number,
   addr: String,
   des: String
};

const account = mongoose.model("account", accountSchema);

app.post('/sign_up', function(req,res){
   var name = req.body.name;
   var pass = req.body.password;
   var email =req.body.mail;
   var phone =req.body.phoneno;
   var addr = req.body.address;
   var des = req.body.description;
   
    console.log(name, pass, email, phone, addr, des);

   var data = new account({
      name,
      pass,
      email,
      phone,
      addr,
      des
   })
   data.save();
   return res.redirect('successsign.html');
})

app.get('/',function(req,res){
  //  res.set({
  //     'Access-control-Allow-Origin': '*'
  //  });
  res.sendFile(__dirname + '/public' + '/index5.html');
})

app.post("/login",async(req,res)=>{
   try{
      const name = req.body.name;
      const pass = req.body.pass;

      const user = await account.findOne({name:name});
      if(user.pass===pass){
         res.status(201).redirect("selectpackages.html");
        // res.send(`Username: ${name} Password: ${pass}`);
      }
      else{
         res.send("password are not matching!");
      }
   } catch(error){
      res.status(400).send("invalid username!");
   }
  
})




app.listen(3000, () => {
  console.log("server listening at port 3000");
})
//http://localhost:3000/