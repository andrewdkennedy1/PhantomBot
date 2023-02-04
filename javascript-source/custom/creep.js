$.bind("command", function (event) {
    var command = event.getCommand(),
        args = event.getArgs(),
        sender = event.getSender(),
        arg = args[0];
    if (command.equalsIgnoreCase("creep")) {
        com.gmt2001.Console.out.println("the command was used by " + sender + " with the argument " + arg);
        if (!arg) {
            $.say("You must provide a user ID.");
        } else {
            var userData = com.gmt2001.TwitchAPIv5.instance().GetUserByID(arg);
            var name = userData.getString("display_name");
            $.say(name);
        }
    }
});

$.bind("initReady", function () {
    $.registerChatCommand("./custom/creep.js", "creep", 7);
});
