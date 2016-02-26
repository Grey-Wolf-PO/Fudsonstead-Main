var sendmessage = function(term) {
//send the push notification
  Parse.Push.send({
    channels: ["friendsgroup"],
    data: {
      alert: term
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
  message.set("text", term);
    message.save(null, {
  success: function(message){
    console.log("successfully saved message");
  },
  error: function(message, error){
    console.log(error);
  }
  });
  loadMessages();
}

var announce = function(term)
{
  var announce_term1 = "<span class=\"announce\">" + term + "</span>"
  var announce_term2 = announce_term1.replace("~announce","")
  return announce_term2;
}

var contains = function(term, text)
{
  var string = text.toLowerCase();
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
    if (contains("~announce", text)) {
      text = announce(text)
    }
    if (contains("**", text)) {
      text = text.bold().replace("**","")
    }
    if (contains("//", text)) {
      text = text.italics().replace("//","")
    }
    if (contains(".randsen", text)) {
      var nouns = ["Mrs. Folkema","Your butt","The frog","Eddie","Jake","Mr. President","The dog","The moose","Your fart","My turd","The car","Mr. Stepanek","Connor Cook","The cookie","The snow","The bull","The cow","The sheep","My barn","The trolling cow","FCS"]
      var assistingwords = ["stinkily","sternly","slowly","quickly","loudly","fiercely","lazily","carefully","carelessly","strongly","weakly","justly","buttishly","expertly","amateurly","freely","wierdly"]
      var verbs = ["jumped","hopped","freaked out","farted","ran the race","ate","burped","became old and clumpy","yelled at the kid","programmed this app","skied down the hill","chomped on his dinner","jumped off the cliff","yelled 'YOLO!'","lied to the cops","hacked into the NSA","built the house","tried to impress the girls"]
      text = text.replace(/.randsen/g, nouns[Math.floor(Math.random() * nouns.length)] + " " + assistingwords[Math.floor(Math.random() * assistingwords.length)] + " " + verbs[Math.floor(Math.random() * verbs.length)] + ".");
    }
    if (contains(":)", text)) {
      text = text.replace(/:\)/g,"😀")
    }

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
//jquery
$(document).ready(function()
{
  //send button clicked
  var text;
  $("#senmesano").click(function()
  {
    //get text from textbox
    text = $('#textInput').val();
    $('#textInput').val('');
    if (contains("~announce", text)) {
      text = announce(text)
    }
    if (contains("**", text)) {
      text = text.bold().replace("**","")
    }
    if (contains("//", text)) {
      text = text.italics().replace("//","")
    }
    if (contains(".randsen", text)) {
      var nouns = ["Mrs. Folkema","Your butt","The frog","Eddie","Jake","Mr. President","The dog","The moose","Your fart","My turd","The car","Mr. Stepanek","Connor Cook","The cookie","The snow","The bull","The cow","The sheep","My barn","The trolling cow","FCS"]
      var assistingwords = ["stinkily","sternly","slowly","quickly","loudly","fiercely","lazily","carefully","carelessly","strongly","weakly","justly","buttishly","expertly","amateurly","freely","wierdly"]
      var verbs = ["jumped","hopped","freaked out","farted","ran the race","ate","burped","became old and clumpy","yelled at the kid","programmed this app","skied down the hill","chomped on his dinner","jumped off the cliff","yelled 'YOLO!'","lied to the cops","hacked into the NSA","built the house","tried to impress the girls"]
      text = text.replace(/.randsen/g, nouns[Math.floor(Math.random() * nouns.length)] + " " + assistingwords[Math.floor(Math.random() * assistingwords.length)] + " " + verbs[Math.floor(Math.random() * verbs.length)] + ".");
    }
    if (contains(":)", text)) {
      text = text.replace(/:\)/g,"😀")
    }
    

//send the push notification
    Parse.Push.send({
      channels: ["friendsgroup"],
      data: {
        alert: text
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
    message.set("text", text);
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