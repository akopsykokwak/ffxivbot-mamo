const { MessageEmbed } = require("discord.js");

function randomizeQuote(quotes) {
  const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomQuoteIndex];
  return randomQuote;
}

function embedRandomQuote(randomQuote) {
  let embedQuote = new MessageEmbed()
    .setColor('#50aed4')
    .setTitle(`✨ ${randomQuote.discordName} a dit :`)
    .setDescription(`"${randomQuote.quote}" (${randomQuote.date})`);
  return embedQuote;
}

module.exports.run = async (client, message, args, db) => {
  let quotes = [];
  try {
    /**
     * retrieve all quotes from the collection in firestore and push them into an array
     */
    await db.collection('quotes').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        quotes.push(doc.data())
      })
    });

    /**
     * send a random quote
     */
    if (args.length === 0 && quotes.length !== 0) {
      let randomQuote = randomizeQuote(quotes);

      let embedQuote = embedRandomQuote(randomQuote);
      message.channel.send(embedQuote);

    }

    else if (args.length > 1 && args[0] === "list" && quotes.length !== 0) {
      let name = args [1];
      const specificUserQuotes = quotes.filter(element => element.discordName === name);

      let embedList = new MessageEmbed()
        .setColor('#50aed4')
        .addFields(
          { name: `✨ Liste des quotes disponibles pour ${name}`, value: specificUserQuotes.map(data => {
            return `${data.quote} *(${data.date})*`
          })}
        )

      message.channel.send(embedList)
    }
    /**
     * send random quote of a specified user
     */
    else if (args.length === 1 && quotes.length !== 0) {
      const name = args[0];
      const specificUserQuotes = quotes.filter(element => element.discordName === name);

      let randomQuote = randomizeQuote(specificUserQuotes);
      let embedQuote = embedRandomQuote(randomQuote);
      message.channel.send(embedQuote);

    } else message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`)

  } catch (error) {
    console.log(error);
    if (error) message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`)
  }
}

module.exports.help = {
  name: 'quote',
  category: '🎲 Jeu',
  description: "Donne une quote au hasard ou d'un utilisateur défini",
  usage: "!quote ou !quote + utilisateur"
}