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
          var lengthOfMessage = newMessage.length
          var text = newMessage.substring(colonPosition,lengthOfMessage)
          var FudsonsteadTime = moment().format('MMMM Do YYYY, h:mm:ss a')
          var questions = ["What are your girlfriend's initials?", "Why are you still in diapers? (Secret revealed)", "What is your favorite color?", "Why do you stalk people?", "Why do you do this to me?"]
          var nouns = ["Mrs. Folkema","Your butt","The frog","Eddie","Jake","Mr. President","The dog","The moose","Your fart","My turd","The car","Mr. Stepanek","Connor Cook","The cookie","The snow","The bull","The cow","The sheep","My barn","The trolling cow","FCS"]
          var assistingwords = ["stinkily","sternly","slowly","quickly","loudly","fiercely","lazily","carefully","carelessly","strongly","weakly","justly","buttishly","expertly","amateurly","freely","wierdly"]
          var verbs = ["jumped","hopped","freaked out","farted","ran the race","ate","burped","became old and clumpy","yelled at the kid","programmed this app","skied down the hill","chomped on his dinner","jumped off the cliff","yelled 'YOLO!'","lied to the cops","hacked into the NSA","built the house","tried to impress the girls"]
           if(text.toUpperCase() === text && text.toLowerCase() != text)
          {
            console.log("Caps abuse");         
            sendMessage("Please do not abuse caps.")
          }
           if(contains("andhisnameisjohncena"))
          {
            console.log("Banned phrase");
            messages[0].set("text","Your message contained a banned phrase.")
            messages[0].save();
          }
           if(contains("lookatallthosechickens"))
          {
            console.log("Banned phrase");
            messages[0].set("text","Your message contained a banned phrase.")
            messages[0].save();
          }
           if(contains("deeznuts"))
          {
            console.log("Banned phrase");
            messages[0].set("text","Your message contained a banned phrase.")
            messages[0].save();
          }
           if(contains(".randsen"))
          {
            console.log("Requested rand. sentence");
            var item1 = Math.floor(Math.random() * nouns.length)
            var item2 = Math.floor(Math.random() * assistingwords.length)
            var item3 = Math.floor(Math.random() * verbs.length)
            sendMessage(nouns[item1] + " " + assistingwords[item2] + " " + verbs[item3] + ".")         
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
           if(contains(".lm"))
          {
            console.log("Message request")
            var newMessageLastCharacter = newMessage.length
            var messageLastChar = newMessage.substring(newMessageLastCharacter - 1,newMessageLastCharacter)
            var character = messages[1].attributes.text.substring(messageLastChar - 1,messageLastChar)
            sendMessage(character)       
          }
           if(contains(":)"))
          {
            console.log("Get Emoji");
            var newMessage2 = newMessage.replace(":)","😀")
            messages[0].set("text",newMessage2)
            messages[0].save();            
          }
           if(contains("snowday") && contains(":"))
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
           if(newMessage.length === 59)
          {
            console.log("Lucky message");
            sendMessage(name + " has just sent a lucky message! Congrats!".bold())
          }

          var checked = newMessage
          previousMessage = messages[1].attributes.text
        }
      }
    }
  });
}, 2500);