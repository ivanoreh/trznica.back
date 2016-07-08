var postmark = require("postmark");

// Example request
var client = new postmark.Client("4307c8f4-c786-4bbe-a01e-2c09c94d8d4e");

client.sendEmail({
    "From": "no-reply@bosso.lu",
    "To": "ivan.oreh@hotmail.com",
    "Subject": "Test", 
    "TextBody": "Hello from Postmark!"
});
