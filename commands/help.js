const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, db) => {
  if(args.length !== 0) {
    return message.channel.send(`🚫 Erreur ! La commande est tout simplement **!help**. `)
  }
  
  fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
      console.log("Il n'y a aucune commande.");
      return;
    }

    let data = []
    jsfiles.map((f, i) => {
      let props = require(`./${f}`);
      data.push(props)
    })

    function compare(a, b) {
      const x = a.help.name.toUpperCase();
      const y = b.help.name.toUpperCase();
    
      let comparison = 0;
      if (x > y) {
        comparison = 1;
      } else if (x < y) {
        comparison = -1;
      }
      return comparison;
    }    

    let result = new Discord.MessageEmbed()
      .setColor('#50aed4')
      .setTitle("✨ Voici la liste de toutes mes commandes :")
      .addFields(data.sort(compare).map(prop => {
        return { name: `!${prop.help.name}`, value: `*${prop.help.category}* \n ${prop.help.description}`}
      })
      );

    message.channel.send(result)
  });
}

module.exports.help = {
  name: 'help',
  category: '🤖 Bot',
  description: "Renvoie une liste des commandes disponibles",
  usage: '!help'
}