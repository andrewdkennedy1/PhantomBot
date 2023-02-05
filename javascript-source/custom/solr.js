$.bind("command", function (event) {
    var command = event.getCommand(),
        args = event.getArgs(),
        sender = event.getSender(),
        arg = args[0];
    if (command.equalsIgnoreCase("solr")) {
        var keys = $.inidb.GetKeysByOrderValue("incoming_raids", "");
        let raids = [];

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let json = JSON.parse($.inidb.get("incoming_raids", key));

            raids.push([
                key,
                new Date(parseInt(json.lastRaidTime)).toLocaleString(),
                json.lastRaidViewers ? json.lastRaidViewers : '0',
                json.totalRaids ? json.totalRaids : '1',
                json.totalViewers ? json.totalViewers : '0',
                parseInt(json.lastRaidTime)
            ]);
        }

        // sort raids by last raid time in ascending order
        raids.sort(function (a, b) {
            return a[5] - b[5];
        });

        // get the most recent raid username
        let mostRecentRaidUsername = raids[raids.length - 1][0];

        // get the game name of the most recent raid username
        let mostRecentRaidGameName = com.gmt2001.TwitchAPIv5.instance().GetChannel(mostRecentRaidUsername).optString("game");

        // output the most recent raid username and game name

        $.say("!so " + mostRecentRaidUsername + " - Let's share the love with " + mostRecentRaidUsername + " They last streamed " + mostRecentRaidGameName + " Check them out at https://twitch.tv/" + mostRecentRaidUsername);
        
    }
});

$.bind("initReady", function () {
    $.registerChatCommand("./custom/solr.js", "solr", 7);
});
