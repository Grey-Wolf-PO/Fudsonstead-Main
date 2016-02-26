var Parse = require('parse/node');
var schedule = require('node-schedule');
var moment = require('moment');

//initialize parse
Parse.initialize("esdHpW8aEGkiDe95teTcJJNbg7Ah0x8lcYwMrbN9", "DkbLAJCFTAQncBiB7hIcVGNN3jALrmPCdi7AHUv0");

//schedule hourly check-in
/*
var hourly = schedule.scheduleJob('0 * * * *', function(){
    console.log("Time Sent");
    sendMessage(moment().format('MMMM Do YYYY, h:mm:ss a'));
});
*/

var sendMessage = function(text)
{
  //send the push notification
    Parse.Push.send({
      channels: ["friendsgroup"],
      data: {
        alert: text
      }
    }, {
      success: function() {
        // Push was successful
      },
      error: function(error) {
        // Handle error
        console.log(error);
      }
    });

    //save the message object
    var PrivateMessage = Parse.Object.extend("PrivateMessage");
    var message = new PrivateMessage();
    message.set("text", text);
    message.save();
}

var previousMessage = "";
var newMessage = "";


var contains = function(term)
{
  if(newMessage.toLowerCase().indexOf(term) > -1)
  {
    return true;
  }
  else
  {
    false;
  }
}


setInterval(function()
{
  var PrivateMessage = Parse.Object.extend("PrivateMessage");
  var query = new Parse.Query(PrivateMessage);
  query.descending("createdAt");
  query.find({
    success: function(messages) {
      // Successfully retrieved the object.
      //var messageContent = message.f;
      if(messages.length > 0)
      {
        if(messages[0].attributes.text != previousMessage)//if it's a new message
        {
          newMessage = messages[0].attributes.text;

          
          if(newMessage.length > 1000)
          {
            console.log("Trolololl");
            messages[0].destroy();
            sendMessage("I hate trolls... (1 message deleted)");
          }

          if(contains("**"))
          {
            console.log("Bold");
            var messageB = newMessage.bold()
            messages[0].set("text", messageB.replace("**",""))
            messages[0].save();
          }

          if(contains("//"))
          {
            console.log("Italic");
            var messageI = newMessage.italics()
            messages[0].set("text", messageI.replace("//",""))
            messages[0].save();
          }

          if(newMessage.length > 350)
          {
            console.log("Long message");
            sendMessage("Don't send long messages.");
          }
          
          previousMessage = newMessage;
        }
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}, 5000);