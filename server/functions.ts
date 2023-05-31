require('dotenv').config();
const fs = require('fs')
let paths = require('path')
const Mail = require('@sendgrid/mail');
const client = require('@sendgrid/client')

let SENDDRIG_API = process.env.SENDGRID_API_KEY;
Mail.setApiKey(SENDDRIG_API);
client.setApiKey(SENDDRIG_API);

module.exports={
    // sending the mail 
    sendMail: (req, res)=>{
        const body = req.body;

        // checking that all of the variables are there
        if(!body["emailArray"] || !body["subject"] || !body["body"]){
            res.sendStatus(400);
            return;
        }

        // building the message
        const message = {
            to: body["emailArray"],
            from: "idanbkideckel@gmail.com",
            subject: body["subject"],
            text: body["body"]
        }

        // sending the mail
        Mail.sendMultiple(message).then(()=>{
            console.log("sent");
            res.status(200).send("email has been sent");

        }).catch((err)=>{
            res.status(500).send("an error has occord send the mail");
        })
    },

    // gets the statistics from the sengrid
    getStatistics : (req, res)=>{
 
        // the request format
        const request = {
            url: `/v3/messages`,
            method: 'GET',
            qs: {"query": "from_email=\"idanbkideckel@gmail.com\""},

        }

        // getting the data and sending to the user
        client.request(request).then(([response, body])=>{

            // returning the response we got
            res.status(200).send(JSON.stringify(response["body"]))
            console.log(response["body"])

        }).catch((err) =>{
            // returning the error
            console.log(err.response["body"]);
            res.status(500).send("an error occurd");
        })
    }
}