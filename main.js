const fs = require('fs');
require('dotenv/config');

//import settings;
let prefix;
const owner = process.env.OWNER;
const token = process.env.TOKEN;

const { Client, Collection } = require('discord.js');
const Twitter = require('twit');

const client = new Client();
client.commands = new Collection();

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const destChannelTweets = '471963083158323200';

const twitterId = 161223454;
const stream = twitterClient.stream('statuses/filter', {
  follow: '161223454',
});

stream.on('tweet', tweet => {
  if (tweet.user.id === twitterId && tweet.in_reply_to_user_id === null && !tweet.retweeted_status) {
    const twitterMessage = `${tweet.text}`
    client.channels.cache.get(destChannelTweets).send(twitterMessage);
  } else return;
});

client.queue = new Map();

fs.readdir('./commands', (err, files) => {
  if (err) {
    console.log(err);
  }

  let commandFiles = files.filter(f => f.split(".").pop() === "js");

  if (commandFiles.length === 0) {
    console.log("No files found");
    return;
  }

  commandFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded`);
    client.commands.set(props.help.name, props);
  })
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//bot login
client.login(token)