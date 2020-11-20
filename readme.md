# PS5bot

## ⚠️ this project is not maintained anymore

Sorry yall, but I have other things to do 😿. Plus there are situations I've no clue how to solve such as traffic spikes and captchas, and situations that are basically impossible to bypass (e.g. loading queues for PlayStation Direct). For these reasons, I'm archiving this project. Hey, at least we don't need to worry about all this for Cyberpunk!

ps5bot is a dead simple auto-checkout bot to buy a PlayStation 5 from PlayStation Direct, Target, and Walmart (planned: Gamestop, BestBuy).

![prestine image of naked man punching tank go boom](https://media.giphy.com/media/ECpTuaJw4kRq0/giphy.gif)

## Installation overview

Linux, macOS, and Windows are all capable operating systems.

You do not need any computer skills, smarts, or anything of that nature. You are very capable as you have made it this far. Some basic understanding how a terminal, git, and or Node.js is a bonus, but that does not limit you to getting PS5bot running!

### Installation

 1. [Install Node.js](https://nodejs.org/en/)
    1. version should be >12.9
 2. [Install git](https://git-scm.com/)
 3. download this project
    1. `git clone https://github.com/VVNoodle/PS5bot`
 4. Open up a terminal
 5. go to project directory `cd /the/project/directory`
 6. Install `yarn` by running `npm i -g yarn`
 7. Install dependencies by running `yarn`
 8. Make CLI callable  
    `yarn link`  

## Setup

 1. Run ps5bot. You'll be prompted to fill in required checkout info  
    `ps5bot`  
    **Note: Below steps are still TODO**  
 2. Run scraper
    `ps5bot scrape`
    - you will be asked to select the sites to run the bot. If you don't select anything, it will try to run on all websites.

## Bot Configs

Configs are read in `config.json` file. You can either run `ps5bot` to generate a config file, or duplicate `configTemplate.json`, rename to `config.json`, and fill out the fields.

```js
{
  "firstName": "Qwer",
  "lastName": "Ty",
  "phoneNumber": "8011111111",
  "email": "email@example.com",
  "state": "State",
  "city": "Random City",
  "address": "2353 Running Water Ct.",
  "zipCode": "95054",
  "creditCardNumber": "0101101010101",
  "expirationMonth": "10",
  "expirationYear": "2022",
  "cvv": "000",
  "targetEmail": "email2@example.com",
  "targetPassword": "1312321"
}
```

- Double quotes on text is required
- Anything after the `//` are comments for clarification. Remove them if you try to copy paste this example (including the `//`).
- for Target, make sure you have no carts in your account already

### Credit Cards supported

| Site               | Cards                                        |
|--------------------|----------------------------------------------|
| PlayStation Direct | MasterCard, Visa, Discover                   |
| Walmart            | MasterCard, Visa, Discover, American Express |
| Target             | MasterCard, Visa, Discover, American Express |

Make sure to run this script and keep the terminal open around the time of the schedule

## Notes

- Make sure not to use a VPN since it will possibly trigger captcha verification.
- There's a chance WalMart checkout ask for captcha after entering address. If this is the case, bot will pause. As soon as you complete them, bot will resume.
- You need a login for Target. And make sure no existing carts.

PS5bot exists to:

- practice web scraping and to
- buy a **single** PS5 for myself  
The second point is fair imo since it's pretty much an automated version of constantly clicking refresh to buy stuff.  
Also: This is not intended to scalp massive quantities of PS5s. That shit aint cool.
