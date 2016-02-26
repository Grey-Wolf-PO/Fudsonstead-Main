var Parse = require('parse/node');
var schedule = require('node-schedule');
var moment = require('moment');
var nodegit = require('nodegit');
var Promise = require('promise');

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
    var name = "GoldieBot"
    var message = text
    Parse.Push.send({
      channels: ["friendsgroup"],
      data: {
        alert: text.bold() + "\n" + "-" + name
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
    message.set("text", text.bold() + "\n" + "-" + name);
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

var git = function(times) {
  nodegit.Repository.open('../Hubs/Main').then(function(repo) {
    /* Get the current branch. */
    return repo.getCurrentBranch().then(function(ref) {

      /* Get the commit that the branch points at. */
      return repo.getBranchCommit(ref.shorthand());
    }).then(function (commit) {
      /* Set up the event emitter and a promise to resolve when it finishes up. */
      var hist = commit.history(),
          p = new Promise(function(resolve, reject) {
              hist.on("end", resolve);
              hist.on("error", reject);
          });
      hist.start();
      return p;
    }).then(function (commits) {
      /* Iterate through the last 10 commits of the history. */
      for (var i = 0; i < times; i++) {
        var sha = commits[i].sha().substr(0,7),
            msg = commits[i].message().split('\n')[0];
        sendMessage(msg);
      }
    });
  }).catch(function (err) {
    console.log(err);
  }).done(function () {
   console.log('Finished git');
  });
}

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
        var colonPosition = newMessage.indexOf(":")
        if (newMessage.indexOf("]") < 9 && newMessage.indexOf("]") > -1) {
          var startOfName = newMessage.indexOf("]") + 2
        }
        else {
          var startOfName = 0
        }
        var name = newMessage.substring(startOfName, colonPosition)
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
          if (contains("!greeting")) {
            console.log("!greeting has appeared in chat")
            sendMessage("Hello!")
          }
          if (contains("!myname")) {
            console.log("!myname has appeared in chat")
            sendMessage(name)
          }
          if (contains("!pick")) {
            console.log("!pick has appeared in chat")
            var txt = newMessage.substring(newMessage.indexOf(":") + 1, newMessage.length)
            o1 = txt.indexOf("k ")
            o2 = txt.indexOf(", ")
            op1 = txt.substring(o1 + 2, o2)
            op2 = txt.substring(o2 + 2, newMessage.length)
            var opts = [op1, op2]
            var ranpick = opts[Math.floor(Math.random() * 2)]
            sendMessage("I randomly picked: " + ranpick)
          }
          if (contains("!gitcommit")) {
            console.log("!git has appeared in chat")
            console.log("Starting git")
            git(3)
          }
          var checked = newMessage
        }
      }
    }
  });
}, 2500);