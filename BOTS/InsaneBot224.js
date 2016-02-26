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
  var string = newMessage.toLowerCase();
  var string2 = string.replace(/ /g,"");
  if(string2.indexOf(term) > -1)
  {
    return true;
  }
  else
  {
    false;
  }
}
var name_contains = function(term)
{
  var string = name.toLowerCase();
  var string2 = string.replace(/ /g,"");
  if(string2.indexOf(term) > -1)
  {
    return true;
  }
  else
  {
    false;
  }
}
var remove_array = function(item, array) {
  var i = array.indexOf(item);
  if(i != -1) {
    array.splice(i, 1);
  }
}

mutes = [""]

setInterval(function()
{
  var PrivateMessage = Parse.Object.extend("PrivateMessage");
  var query = new Parse.Query(PrivateMessage);
  query.descending("createdAt");
  query.find({
    success: function(messages) {
      // Successfully retrieved the object.
      //var messageContent = message.f;
      if(messages.length > 0 && newMessage != checked)
      { 
        newMessage = messages[0].attributes.text;
        previousMessage = messages[1].attributes.text;
         if(newMessage === previousMessage && newMessage != "Your message contained a banned phrase.")
        {
          console.log("SPAM");
          messages[0].destroy();
          sendMessage("Derpy spammers...")
        }
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
          if (text.toUpperCase() === text && text.toLowerCase() != text) {
            messages[0].set("text", "No caps abuse.")
          }
          if (contains("deeznuts")) {
            messages[0].set("text", "Banned phrase.")
          }
          if (contains("andhisnameisjohncena")) {
            messages[0].set("text", "Banned phrase.")
          }
          if (contains("johncena") && !contains("andhisnameisjohncena")) {
            messages[0].set("text", "Banned phrase.")
          }
          if (contains("areyoufreefridaynight")) {
            messages[0].set("text", "Banned phrase.")
          }
          if (contains("pokemonsucks")) {
            messages[0].set("text", "Banned phrase.")
          }
          if (contains("tigerssuck")) {
            messages[0].set("text", "Banned phrase.")
          }
          if (newMessage.length > 1000) {
            messages[0].destroy();
          }
          if (contains("ingamord")) {
            messages[0].destroy();
          }
          var checked = newMessage
          previousMessage = messages[1].attributes.text
        }
      }
    }
  });
}, 2500);