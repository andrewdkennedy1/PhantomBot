$.bind("command", function (event) {
  var command = event.getCommand(),
    args = event.getArgs(),
    sender = event.getSender();
    var arg = args[0];
  if (command.equalsIgnoreCase("setcpv")) {
    if (!$.isMod(sender)) return;
    if (args.length !== 2)
      return com.gmt2001.Console.out.println("Expected syntax: !setcpv <the_exact_key> <value>");

    const [key, value] = args;
    const intValue = parseInt(value);

    if (isNaN(intValue)) return com.gmt2001.Console.out.println("Invalid value.");

    $.inidb.set("commandCount", key, intValue);
    com.gmt2001.Console.out.println(`Value for key ${key} has been set to ${intValue}.`);
  }

  if (command.equalsIgnoreCase("listcpv")) {

    if (args.length !== 1)
      return com.gmt2001.Console.out.println("Expected syntax: !listcpv <search_term>");

    const [searchTerm] = args;
    const keys = $.inidb
      .GetKeysByOrderValue("commandCount")
      .filter((key) => key.toLowerCase().includes(searchTerm));

    com.gmt2001.Console.out.println(`Keys containing "${searchTerm}": ${keys.join(", ")}`);
  }
});

$.bind("initReady", (e) => {
  $.registerChatCommand("./custom/setcpv.js", "setcpv", 1);
  $.registerChatCommand("./custom/setcpv.js", "listcpv", 1);
});