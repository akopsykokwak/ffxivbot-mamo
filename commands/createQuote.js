module.exports.run = async (client, message, args, db) => {
  const regex = new RegExp('"[^"]+"|[\\S]+', 'g');

  if(args.length !== 0) {
    const arrayArguments = args.join(' ').match(regex);
    const quote = arrayArguments[0];
    const user = arrayArguments[1];
    const date = arrayArguments[2];
  
    if(quote !== undefined && user !== undefined) {
      db.collection('quotes').add({
        quote: quote.replace(/^"|"$/g, ''),
        discordName: user,
        date: date.replace(/^"|"$/g, '')
      });

      message.channel.send(`✨ La quote de ${user} a bien été enregistréé !`)
    }

  } else {
    message.channel.send("Erreur 🚫 : vous devez inscrire une quote et le nom de l'utilisateur")
  }
}

module.exports.help = {
  name: 'createQuote',
  category: '🤖 Bot',
  description: "Crée une quote pour un utilisateur",
  usage: `!createQuote + "quote" + utilisateur + "date"`
}