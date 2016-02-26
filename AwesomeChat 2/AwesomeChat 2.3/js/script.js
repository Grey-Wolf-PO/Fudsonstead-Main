//vars

var d = new Date();
var n = d.getHours();
var m = d.getDate();
var colon = ": "
var rp = "["
var lp = " ] "

//initialize parse
Parse.initialize("esdHpW8aEGkiDe95teTcJJNbg7Ah0x8lcYwMrbN9", "DkbLAJCFTAQncBiB7hIcVGNN3jALrmPCdi7AHUv0");

//get the username
var name = prompt("Enter your username:");



//jquery
$(document).ready(function()
{
  //send button clicked
  var text;
  $("#sendButton").click(function()
  {
    //get text from textbox
    text = $('#textInput').val();
    $('#textInput').val('');

//send the push notification
    Parse.Push.send({
      channels: ["friendsgroup"],
      data: {
        alert: rp + m + ", " + n + lp + name + colon + text
      }
    }, {
      success: function() {
        // Push was successful
        console.log('successful send');
      },
      error: function(error) {
        // Handle error
        console.log(error);
      }

    });

    //save the message object
    var PrivateMessage = Parse.Object.extend("PrivateMessage");
    var message = new PrivateMessage();
    var d = new Date();
    var m = d.getDate();
    var n = d.getHours();
    message.set("text", rp + m + ", " + n + lp + name + colon + text);
    message.save(null, {
      success: function(message){
        console.log("successfully saved message");
      },
      error: function(message, error){
        console.log(error);
      }
    });

    loadMessages();
  });

  //load messages
  loadMessages();

  //on refresh click
  $("#refreshButton").click(function(){
    loadMessages();
  });
});


//load messages
var loadMessages = function(){
  var PrivateMessage = Parse.Object.extend("PrivateMessage");
  var query = new Parse.Query(PrivateMessage);
  query.descending("createdAt");
  query.find({
    success: function(messages) {
      // Successfully retrieved the object.
      //var messageContent = message.f;
      console.log(messages.length);
      for(var i = messages.length - 1; i >= 0; i--)
      {
        var messageContent = messages[i].attributes.text;
        console.log(messages[i].attributes.text);
        $("#messagesHeader").after("<p class=\'message\'>"+messageContent+"</p>");
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });


};