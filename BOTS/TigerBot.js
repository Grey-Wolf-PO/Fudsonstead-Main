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
    var message = text
    Parse.Push.send({
      channels: ["friendsgroup"],
      data: {
        alert: message
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
    message.save(null, {
      success: function(message){
      },
      error: function(message, error){
        console.log(error);
      }
    });
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
          var colonPosition = newMessage.indexOf(":",0)
          var lengthOfMessage = newMessage.length
          var text = newMessage.substring(colonPosition,lengthOfMessage)
          var FudsonsteadTime = moment().format('MMMM Do YYYY, h:mm:ss a')
          var questions = ["What are your girlfriend's initials?", "Why are you still in diapers? (Secret revealed)", "What is your favorite color?", "Why do you stalk people?", "Why do you do this to me?"]

           if(text.toUpperCase() === text && text.toLowerCase() != text)
          {
            console.log("Caps abuse");         
            sendMessage("Please do not abuse caps.")
          }
           if(contains(".time"))
          {
            console.log("Requested moment");
            sendMessage(FudsonsteadTime)           
          }
           if(contains(".bquestion"))
          {
            console.log("Ask question");
            var item1 = Math.floor((Math.random() * 5) + 1);
            var item2 = item1 - 1
            var questionToAsk = "TigerBot" + ": " + questions[item2]
            sendMessage(questionToAsk)           
          }
           if(contains(":)"))
          {
            console.log("Get Emoji");
            var newMessage2 = newMessage.replace(":)","😀")
            messages[0].set("text",newMessage2)
            messages[0].save();            
          }
           if(contains("snow day") && contains(":"))
          {
            console.log("Snow Day");
            var snowDayAlert = "It is a snow day!!! Hooray!!!"
            var snowDayAlertF = snowDayAlert.bold();
            sendMessage(snowDayAlertF)
          }
           if(contains("//"))
          {
            console.log("Italic");
            var messageItalic = newMessage.italics()
            var messageI = messageItalic.replace("//","")
            messages[0].set("text",messageI)
            messages[0].save();
          }
          if(contains("**"))
          {
            console.log("Bold");
            var messageBold = newMessage.bold()
            var messageB = messageBold.replace("**","")
            messages[0].set("text",messageB)
            messages[0].save();
          }
          if(newMessage.length > 150)
          {
            console.log("LONG MESSAGE");
            sendMessage("Don't send long messages.");
          }
          if(newMessage.length > 1000)
          {
            console.log("Troll");
            messages[0].destroy();
            sendMessage("I hate trolls....")
          }

          previousMessage = newMessage;
        }
      }
    }
  });
}, 5000);