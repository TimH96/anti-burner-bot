//const TwitchApi = require("node-twitch").default;
//const tmi = require('tmi.js');

/*const twitch = new TwitchApi({
	client_id: "YOUR_CLIENT_ID",
	client_secret: "YOUR_CLIENT_SECRET"
})*/

// Define configuration options
const opts = {
	identity: {
	  username: "oddbod",
	  password: "w9z4t2jmrzs0iwlu2ie9k3gcndrjli"
	},
	channels: [
		"oddbod"
	]
  };
  
  // Create a client with our options
  const client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on('message', [onMessageHandler, testhandler]);
  client.on('connected', onConnectedHandler);

  // Connect to Twitch:
  client.connect();

  function testhandler(target, context, msg, self) {
	console.log("MOOOOOOOOOOOOOOIN")
  }

  // Called every time a message comes in
  function onMessageHandler (target, context, msg, self) {
	console.log(target)
	console.log(context)
	//if (self) { return; } // Ignore messages from the bot
  
	// Remove whitespace from chat message
	const commandName = msg.trim();
  
	// If the command is known, let's execute it
	if (commandName === '!dice') {
	  const num = rollDice();
	  client.say(target, `You rolled a ${num}`);
	  console.log(`* Executed ${commandName} command`);
	} else {
	  console.log(`* Unknown command ${commandName}`);
	}
  }
  
  // Function called when the "dice" command is issued
  function rollDice () {
	const sides = 6;
	return Math.floor(Math.random() * sides) + 1;
  }
  
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
  }
