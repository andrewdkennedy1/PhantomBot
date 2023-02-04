//need this in channelpoints redeem response to work `(cpdisplayname) redeemed (cptitle) (count 1 (cpuserid)+(cpdisplayname)+(cptitle)) times!` 
$.bind("command", function (event) {
  var command = event.getCommand().toLowerCase();
  var args = event.getArgs();
  var redeemTitle = args[0];

  if (command.equalsIgnoreCase("leaderboard")) {
    var keys = $.inidb
      .GetKeysByOrderValue("commandCount")
      .filter(function (key) {
        return /^\d/.test(key);
      });
    if (!keys.length) return;

    var data = keys.map(function (key) {
      var value = $.inidb.get("commandCount", key);
      var keyParts = key.split("\\+");
      var userId = keyParts[0];
      var displayName = keyParts[1];
      var title = keyParts[2];
      return { userId, displayName, title, value };
    });

    var sortedData = data.sort(function (a, b) {
      return b.value - a.value;
    });

    var filteredData;
    if (redeemTitle) {
      filteredData = sortedData.filter(function (entry) {
        return entry.title.toLowerCase().includes(redeemTitle.toLowerCase());
      });
      if (!filteredData.length) {
        return $.say(redeemTitle + " is not a valid redeem title.");
      }
    } else {
      filteredData = sortedData;
    }

    var message = filteredData
      .slice(0, 3)
      .map(function (entry) {
        return redeemTitle ? 
          entry.displayName + " - " + entry.value :
          entry.displayName + " (" + entry.title + ") - " + entry.value;
      })
      .join(" | ");
    $.say(message);
  }
});

$.bind("initReady", function () {
  $.registerChatCommand("./custom/leaderboard.js", "leaderboard", 7);
});
