# PS5bot

ps5bot is a dead simple auto-checkout bot to purchase a PlayStation 5 from direct.playstation.com, and other sites (planned: Target, Gamestop).

## Installation overview

Linux, macOS, and Windows are all capable operating systems.

You do not need any computer skills, smarts, or anything of that nature. You are very capable as you have made it this far. Some basic understanding how a terminal, git, and or Node.js is a bonus, but that does not limit you to getting PS5bot running!

### Installation

 1. [Install Node.js](https://nodejs.org/en/)
 2. [Install git](https://git-scm.com/)
 3. download this project
    1. `git clone https://github.com/VVNoodle/PS5bot`
 4. Open up a terminal
 5. go to project directory `cd /the/project/directory`
 6. Install dependencies by running `npm install`
 7. Make CLI callable  
    `yarn link`  

## Setup

 1. Run ps5bot. You'll be prompted to fill in required checkout info  
    `ps5bot`  
    **Note: Below steps are still TODO**  
 2. Set schedule for scraper to run  
    `ps5bot schedule`  
 3. Run ps5bot around the time scheduled  
    `ps5bot run`  
Make sure to run this script and keep the terminal open around the time of the schedule

## Note

The purpose of building PS5bot is:

- to practice web scraping and
- to buy a PS5 for myself  
The second pointer is fair imo since it's pretty much an automated version of constantly clicking refresh to buy shit.  
Also: This is not intended to scalp massive quantities of PS5s. That's not cool.
