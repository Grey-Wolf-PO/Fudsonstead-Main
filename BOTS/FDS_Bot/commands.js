'use strict';
// use return false to show that the command didnt go through to prevent triggering false monitor moderations
Tools.Formats = require("./data/pokemon.js").BattleFormatsData;
Tools.Pokedex = require("./data/pokedex.js").BattlePokedex;
Tools.helpEntries = require("./help.js").help;
Tools.Movedex = require("./data/moves.js").BattleMovedex;

function uncacheTree(root) {
    let uncache = [require.resolve(root)];
    do {
        let newuncache = [];
        for (let i = 0; i < uncache.length; ++i) {
            if (require.cache[uncache[i]]) {
                newuncache.push.apply(newuncache,
                    require.cache[uncache[i]].children.map(function(module) {
                        return module.filename;
                    })
                );
                delete require.cache[uncache[i]];
            }
        }
        uncache = newuncache;
    } while (uncache.length > 0);
}  

exports.commands = {
    reloadcmds: function() {  
        uncacheTree("./commands.js");
        Commands = require("./commands.js").commands;
        this.can("say")
        this.send("CMDs reloaded.")
        console.log("Successfully reloaded commands.")
    },
    owner: function() {
        this.can("say");
        this.send("My owner is the awesome FDS group.");
        this.can("set");
    },
    git: function(target, room, user) {
        this.can("set");
        this.send("I'm sorry, my GitHub repo is private.");
    },
    intro: function() {
        this.can("say")
        this.send("Hi! I'm " + Monitor.username + ", and I'm FDS's current bot.");
        this.send("**You can request any changes made to me and my owner will consider it, and by the way I am based of FoxieBot.**")
        this.send("Have a good day!")
    },
    drunk: function(howdrunk) {
        if (!(howdrunk > 10)) {
            for (var i = 0; i < howdrunk; i++) {
                this.can("say");
                this.send("Blibber jabber little labber nord rond");
            }
        }
        else {
            this.can("say")
            this.send("The amount of drunkness you entered is too high. (Caps at ten)")
        }
    },
    rcmd: function(command) {
        if ((command.indexOf("/") === 0 || command.indexOf("!") === 0) && command != "/part" && command != "/logout" && command != "/leave") {
            this.can("say")
            this.send(command)
        }
        else {
            this.can("say")
            this.send("This text is not a command, or you have used a banned command.")
        }
    },
    join: function(room) {
        this.send("/join " + room)
    },
    randsen: function() {
        var nouns = ["Mrs. Teacher","Your butt","The frog","Joseph","Jake","Mr. President","The dog","The moose","Your fart","My turd","The car","Mr. Teacher","Connor Cook","The cookie","The snow","The bull","The cow","The sheep","My barn","The trolling cow","Pokémon Showdown"]
        var assistingwords = ["stinkily","sternly","slowly","quickly","loudly","fiercely","lazily","carefully","carelessly","strongly","weakly","justly","buttishly","expertly","amateurly","freely","wierdly"]
        var verbs = ["jumped","hopped","freaked out","farted","ran the race","ate","burped","became old and clumpy","yelled at the kid","programmed this website","skied down the hill","chomped on his dinner","jumped off the cliff","yelled 'YOLO!'","lied to the cops","hacked into the NSA","built the house","tried to impress the girls"]
        var item1 = Math.floor(Math.random() * nouns.length)
        var item2 = Math.floor(Math.random() * assistingwords.length)
        var item3 = Math.floor(Math.random() * verbs.length)
        this.can("say")
        this.send(nouns[item1] + " " + assistingwords[item2] + " " + verbs[item3] + ".")
    },
    rand: function(x) {
        this.send(Math.floor(Math.random() * (x - 0 + 1) + 0))
    },
    say: function(target, room, user) {
        if (!this.can("say")) return false;
        return this.send(removeCommand(target));
    },
    //settings
    addchar: function(target, room, user) {
        if (!this.can("set") || !room) return false;
        if (target.length !== 1 || toId(target) || target === " ") return this.send("The command character has to be 1 character long, and cannot be an alphanumeric character.");
        if(room.commandCharacter.includes(target)) return this.send("This is already a command character in this room.")
        room.addCommandCharacter(target);
        this.send(target + " has been added to this room's command characters.");
    },
    setchar: function(target, room, user) {
        if (!this.can("set") || !room) return false;
        if (target.length !== 1 || toId(target) || target === " ") return this.send("The command character has to be 1 character long, and cannot be an alphanumeric character.");
        room.commandCharacter = [];
        room.addCommandCharacter(target);
        this.send(target + " is set as this room's command character.");
    },
    deletechar: function(target, room, user) {
        if (!this.can("set") || !room) return false;
        if (target.length !== 1 || toId(target) || target === " ") return this.send("The command character has to be 1 character long, and cannot be an alphanumeric character.");
        if (room.commandCharacter.length === 1) return this.send("You need at least one command character in every room!");
        if (!room.commandCharacter.includes(target)) return this.send("That is not one of the room's command characters!");
        room.removeCommandCharacter(target);
        this.send(target + " has been removed from this room's command characters.");
    },
    setprivate: function(target, room, user) {
        if (!this.can("set") || !room) return false;
        switch (toId(target)) {
            case "on":
                Db("settings").set([room.id, "isPrivate"], true);
                room.isPrivate = true;
                break;
            case "off":
                Db("settings").set([room.id, "isPrivate"], false);
                room.isPrivate = false;
                break;
            default:
                return this.send("This room is currently marked as " + (Db("settings").get([room.id, "isPrivate"], false) ? "private." : "public."));
        }
        return this.send("This room is currently marked as " + (Db("settings").get([room.id, "isPrivate"], false) ? "private." : "public."));
    },
    set: function(target, room, user) {
        if (!this.can("set") && !this.can("addcom")) return false;
        if (!target) return this.parse("/help set");
        let parts = target.replace(/\, /g, ",").split(",");
        if (parts[0] === "mod") {
            if (!this.can("set") || !room) return false; // roomowner only
            if (!parts[1] || !parts[2]) return this.parse("/help set mod");
            parts[2] = parts[2].trim().replace(/^reg$/i, " ");
            if (!Config.modSettings[toId(parts[1])] || (!["on", "off"].includes(parts[2].toLowerCase()) && !(parts[2] in Config.ranks))) return this.parse("/help set mod");
            let modAspect = toId(parts[1]);
            let modSetting = parts[2].toLowerCase();
            Db("settings").set([room.id, "moderation", modAspect], modSetting);
            return this.send("Moderation for " + modAspect + " will be applied to users of rank \"" + modSetting + "\" and below.");
        }
        let targetCommand = toId(parts[0]);
        let mainCommand;
        if(Commands[targetCommand] && !Config.settableCommands[targetCommand] && typeof Commands[targetCommand] === "string"){
            mainCommand = Commands[targetCommand];
        }
        if (Config.settableCommands[mainCommand || targetCommand]) {
            if (!this.can("set") || !room) return false; // roomowner only
            if(mainCommand) targetCommand = mainCommand;
            if (!parts[1]) return this.parse("/help set");
            let targetSetting = parts[1].toLowerCase();
            if (!Config.ranks[targetSetting] && !["on", "off"].includes(targetSetting)) return this.parse("/help set");
            Db("settings").set([room.id, targetCommand], targetSetting);
            return this.send(room.commandCharacter[0] + targetCommand + " is now " + (toId(targetSetting) ? targetSetting.toUpperCase() : "usable by users " + targetSetting + " and above") + ".");
        }
        let roomCCon = Db("customcommands").get([room ? room.id : "global", targetCommand], null);
        if (roomCCon) {
            let customComSetting = parts[1].toLowerCase();
            if (!Config.ranks[customComSetting]) return this.parse("/help set");
            roomCCon.rank = customComSetting;
            Db("customcommands").set([room ? room.id : "global", targetCommand], roomCCon);
            return this.send("Custom command " + (room ? room.commandCharacter[0] : Config.defaultCharacter[0]) + targetCommand + " is now usable by users " + customComSetting + " and above.");
        }
        this.send(room.commandCharacter[0] + targetCommand + " is neither a custom command nor a regular command on the bot that can be set.")
    },
    bw: "banword",
    regexbanword: "banword",
    banword: function(target, room, user, cmd) {
        if (cmd === "regexbanword" ? (!this.can("set") && user.hasBotRank("+")) : !this.can("banword") || !room) return false;
        if (!target) return this.parse("/help " + (cmd === "bw" ? "banword" : cmd));
        target = target.split(",");
        let points = 3;
        let regexBanword = target.slice(0, target.length - 1).join(",");
        if (isNaN(parseInt(target[target.length - 1]))) {
            regexBanword = target.join(",");
        }
        else if (parseInt(target[target.length - 1]) >= 1) {
            points = parseInt(target[target.length - 1]);
        }
        if (cmd !== "regexbanword") regexBanword = Tools.regexify(regexBanword.trim());
        if (!regexBanword) return this.parse("/help " + (cmd === "bw" ? "banword" : cmd));
        let banwordExists = Db("settings").get([room.id, "bannedWords", regexBanword], null);
        if (banwordExists) return this.send("That already exists as a banned phrase in this room.");
        Db("settings").set([room.id, "bannedWords", regexBanword], points);
        this.send("The phrase /" + regexBanword + "/i is banned with a point value of " + points + ".");
    },
    unbanword: function(target, room, user) {
        if (!this.can("banword") || !room) return false;
        if (!target) return this.parse("/help unbanword");
        target = target.trim();
        let banwordExists = Db("settings").get([room.id, "bannedWords", target], null);
        if (!banwordExists) {
            target = Tools.regexify(target);
            banwordExists = Db("settings").get([room.id, "bannedWords", target], null);
            if (!banwordExists) {
                return this.send("That's not a banned word in this room!");
            }
        }
        delete Db("settings").object()[room.id].bannedWords[target];
        Db.save();
        this.send("//" + target + "/i has been removed from this room's list of banned words");
    },
    ab: "autoban",
    autoban: function(target, room, user, cmd) {
        if (!this.can("autoban") || !room) return false;
        if (!target) return this.parse("/help autoban");
        target = toId(target);
        if (target.length > 18 || target.length < 1) return this.send("This is not a legal PS username.")
        if (room.userIsBlacklisted(target)) return this.send("This user is already blacklisted.");
        room.blacklistUser(target);
        this.send("/roomban " + target + ", Blacklisted user.");
        this.send("/modnote \"" + target + "\" was added to the blacklist by " + user.name + ".");
        this.send(target + " was successfully added to the blacklist.");
        this.send("/modnote " + target + " was forever banned until the magic command *unab is used.")
    },
    unab: "unautoban",
    unautoban: function(target, room, user) {
        if (!this.can("autoban") || !room) return false;
        if (!target) return this.parse("/help unautoban");
        target = toId(target);
        if (target.length > 18 || target.length < 1) return this.send("That is not a legal PS username.")
        if (!room.userIsBlacklisted(target)) return this.send("This user is not blacklisted.");
        room.unblacklistUser(target);
        this.send("/roomunban " + target);
        this.send("/modnote \"" + target + "\" was removed from the blacklist by " + user.name + ".");
        this.send(target + " was successfully removed from the blacklist.");
    },
    settings: function(target, room, user) {
        let targetRoom = room;
        if (target) {
            if (Rooms.rooms.has(toId(target, true))) {
                targetRoom = Rooms.get(target);
            }
            else {
                if (!room || this.can("settings")) {
                    return user.sendTo("The bot is not in the room you specified.")
                }
                return false;
            }
        }
        if (!user.can("settings", targetRoom)) {
            //not leaking private rooms
            if (targetRoom.isPrivate) return user.sendTo("The bot is not in the room you specified.");
            return false;
        }
        //get list of banned words
        let roomSettings = Db("settings").get(targetRoom.id);
        let nonCommandValues = ["rch", "moderation", "isPrivate", "bannedWords", "roomBlacklist"];

        function buildBannedWords() {
            let buffer = "+----------------------------------+\n" +
                "| BannedWords                      |\n" +
                "+----------------------------------+\n";
            if (roomSettings.bannedWords && Object.keys(roomSettings.bannedWords).length) {
                buffer += Object.keys(roomSettings.bannedWords).map(function(w) {
                    return "| (" + roomSettings.bannedWords[w] + ") " + w + "                              ".slice(w.length + roomSettings.bannedWords[w].toString().length) + "|";
                }).join("\n") + "\n";
            }
            else {
                buffer += "| None!                            |\n";
            }
            buffer += "+----------------------------------+\n\n";
            return buffer;
        }

        function buildBlacklist() {
            let buffer = "+----------------------+\n" +
                "| Blacklisted Users    |\n" +
                "+----------------------+\n";
            if (targetRoom.blacklist && Object.keys(targetRoom.blacklist).length) {
                buffer += Object.keys(targetRoom.blacklist).map(function(w) {
                    return "| - " + w + "                   ".slice(w.length) + "|";
                }).join("\n") + "\n";
            }
            else if (!targetRoom.blacklist || Object.keys(targetRoom.blacklist).length === 0) {
                buffer += "| None!                |\n";
            }
            buffer += "+----------------------+\n\n";
            return buffer;
        }

        function getModerationSettings() {
            let modBuffer = "Moderation Settings: \n" +
                "+-------------------+-----+\n" +
                "| Moderation Aspect |     |\n" +
                "+-------------------+-----+\n";

            modBuffer += Object.keys(Config.modSettings).map(function(aspect) {
                let tSetting = roomSettings.moderation && roomSettings.moderation[aspect] ? roomSettings.moderation[aspect].toUpperCase() : "+";
                return "| " + aspect + "                  ".slice(aspect.length) + "| " + tSetting + "    ".slice(tSetting.length) + "|\n";
            }).join("+ - - - - - - - - - + - - +\n");
            modBuffer += "+-------------------+-----+\n";
            modBuffer += "*NOTE: the bot will moderate users of that rank and lower for each aspect.\n\n";
            return modBuffer;
        }

        function getCommandSettings() {
            let comBuffer = "Command Settings: \n" +
                "+------------------+-----+\n" +
                "| Command          |     |\n" +
                "+------------------+-----+\n";
            let collectCommands = [];
            for (let aspect in roomSettings) {
                if (nonCommandValues.includes(aspect)) continue;
                let tSetting = roomSettings && roomSettings[aspect] ? roomSettings[aspect].toUpperCase() : Config.defaultRank;
                collectCommands.push("|" + aspect + "                  ".slice(aspect.length) + "| " + tSetting + "    ".slice(tSetting.length) + "|\n");
            }
            comBuffer += collectCommands.join("+ - - - - - - - - -+ - - +\n") +
                "+------------------+-----+\n" +
                "*NOTE: Most commands that have not been set require rank " + Config.defaultRank + " to use/broadcast.\n\n";
            return comBuffer;
        }
        let settingsDisplay = "" +
            "Room name: " + targetRoom.name + "\n" +
            "Room ID: " + targetRoom.id + "\n" +
            "Private Room: " + targetRoom.isPrivate + "\n" +
            "Command characters for this room: " + targetRoom.commandCharacter.join(", ") + "\n\n";
        if (roomSettings) {
            settingsDisplay += getModerationSettings() +
                buildBannedWords() +
                buildBlacklist() +
                getCommandSettings();
        }
        Tools.uploadToHastebin("Settings: \n=========\n\n" + settingsDisplay, function(link) {
            user.sendTo("Settings for " + targetRoom.name + ": " + link);
        }.bind(this))
    },

};
