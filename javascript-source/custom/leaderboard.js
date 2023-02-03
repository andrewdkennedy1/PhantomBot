//needs this in the response for channel redeems to function: 
//(cpdisplayname) redeemed (cptitle) (count 1 (cpuserid)+(cptitle)) times!
$.bind("command", function (event) {
  var command = event.getCommand(),
    args = event.getArgs(),
    sender = event.getSender(),
    arg = args[0];
  if (command.equalsIgnoreCase("leaderboard")) {
    com.gmt2001.Console.out.println(
      "the command was used by " + sender + " with the argument " + arg
    );
    var keys = $.inidb
      .GetKeysByOrderValue("commandCount")
      .filter((key) => /^\d/.test(key));
    if (!keys.length) return;
    var data = keys.map((key) => {
      var value = $.inidb.get("commandCount", key);
      var [userId, redeemTitle] = key.split("\\+");
      return [userId, redeemTitle, value];
    });
    if (!arg) {
      var msg = "Top 3 most redeemed: ";
      for (var i = 0; i < 3; i++) {
        var userData = com.gmt2001.TwitchAPIv5.instance().GetUserByID(
          data[i][0]
        );
        var name = userData.getString("display_name");
        msg += `${data[i][1]} by ${name} with ${data[i][2]} | `;
      }

      $.say(msg);
    } else {
      var filteredData = data.filter((entry) =>
        entry[1].toLowerCase().includes(arg.toLowerCase())
      );
      if (!filteredData.length)
        return $.say(arg + " is not a valid redeem title.");
      var matchedRedeemTitle = filteredData[0][1];
      var msg = "Top 3 redeemers for " + matchedRedeemTitle + ": ";
      for (var i = 0; i < Math.min(3, filteredData.length); i++) {
        var userData = com.gmt2001.TwitchAPIv5.instance().GetUserByID(
          filteredData[i][0]
        );
        var name = userData.getString("display_name");
        msg += `${name} with ${data[i][2]} | `;
      }
      $.say(msg);
    }
  }
});
$.bind("initReady", function () {
  $.registerChatCommand("./custom/leaderboard.js", "leaderboard", 7);
});
