This is a lightweight Twitch bot that automatically bans burner accounts (freshly made accounts) to combat harassment. It is built with Node.js and Typescript, and can easily be run from your machine.

## Usage

#### Install

You can download one of the packaged executables from the [releases page](https://github.com/TimH96/anti-burner-bot/releases) and just run that.

Alternatively you can also clone and build the project yourself:

```bash
$ git clone https://github.com/TimH96/anti-burner-bot
$ cd anti-burner-bot
$ npm install
$ npm run build
$ node ./dist/index.js
```

#### Configure

It is recommended to keep the executable in it's own folder, as it will write a ``config.json`` file that it depends on. The bot will prompt you to create this ``config.json`` upon running it for the first time. Here are details on what exactly needs to be put in:

+ **username** is your unique Twitch username. It is the same name that links to your channel (i.e. name ``oddbod`` in ``https://www.twitch.tv/oddbod``). Notice how it should be in all lowercase letters.
+ **client_id** and **client_secret** are required to use the Twitch API. You can get both from [this website](https://dev.twitch.tv/console/apps/create). Create an application (you can just use ``http://localhost`` for the Redirect URL, everything else should be self explanatory) and then browse to it from the overview page. At the bottom of the page, you can find the client ID and generate a new client secret.
+ **oauth** is required for the bot to log in to the chat on your behalf. You can generate a token on [this website](https://twitchapps.com/tmi/). The site will generate a string that looks like ``oauth:<token>``, make sure to only input the actual token into the bot, so only whatever is after the ``oauth:``.
+ **minimum_age** is the age an account needs to be to not be banned. It needs to be given in seconds, for instance input ``86400`` for 1 day or ``21600`` for 6 hours.
+ **ban_reason** is the reason the banned user will receive. This is optional.

#### Run

After configuration, just run the program. It will prompt you for what to do, just enter ``run`` from there to start the bot. You can also reconfigure the bot or show the currently loaded configuration from the initial prompt. 