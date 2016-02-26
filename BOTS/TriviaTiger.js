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
    var name = "TriviaTiger Bot"
    var message = name + ": " + text
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
    message.set("text", name + ": " + text);
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
  if(newMessage.toLowerCase().replace(/ /g,"").indexOf(term) > -1)
  {
    return true;
  }
  else
  {
    false;
  }
}

game = false
bping = 0
qasker = 0

var i = setInterval(function()
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
          var colonPosition = newMessage.indexOf(":")
          if (newMessage.indexOf("]") < 9 && newMessage.indexOf("]") > -1) {
            var startOfName = newMessage.indexOf("]") + 2
          }
          else {
            var startOfName = 0
          }
          var name = newMessage.substring(startOfName, colonPosition)
          if (contains(".sct")) {
            console.log("A new round has started")
            sendMessage("A new round of Trivia Classic has started".bold())
            sendMessage("Open for you (Do dot no-space me)".bold())
            game = true
            bping = 1
          }
          if (contains(".me") && game === true && bping === 1) {
            qasker = name
            bping = 0
            var m = "It is now " + qasker + "'s turn to ask a question."
            sendMessage(m.bold())
          }
          if (contains(".que") && qasker === name) {
            messages[0].set("text", newMessage.bold().replace(".que",""));
            messages[0].save();
          }
          if (contains("~yes") && qasker === name && !contains("<triviatigerbot>")) {
            qasker = newMessage.substring(newMessage.indexOf("<") + 1, newMessage.indexOf(">"))
            var m = "It is now " + qasker + "'s turn to ask a question."
            sendMessage(m.bold())
          }
          if (contains("~yes") && contains("<triviatigerbot>") && qasker === name)
            sendMessage("The user \"TriviaTiger Bot\" is not available for a question.".bold())
          }
      }
    }
  });
}, 2500);