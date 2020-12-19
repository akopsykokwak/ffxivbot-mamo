const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, db) => {
  if (args.length > 0) {

    fs.readdir("./commands/", (err, files) => {
      if (err) console.error(err);

      let selectedCommand;

      let jsfiles = files.filter(f => f.split(".").pop() === "js");
      if (jsfiles.length <= 0) {
        console.log("🚫 Il n'y a aucune commande de disponibles.");
        return;
      }
      let result = jsfiles.forEach((f, i) => {
        let props = require(`./${f}`);
        if(props.help.name === args[0]) selectedCommand = props;
      });

      if(selectedCommand) {
        const embedMessage = new Discord.MessageEmbed()
        .setColor('#50aed4')
        .setTitle('Commande :')
        .setDescription(selectedCommand.help.usage)

        message.channel.send(embedMessage)
      } else {
        message.channel.send(`🚫 Aucune commande n'a été trouvé. Veuillez réessayer.`)
      }
    });
  } else message.channel.send(`🚫 Oups. N'oubliez pas d'ajouter une commande.`)
  ;
}

module.exports.help = {
  name: 'helpCommand',
  category: '🤖 Bot',
  description: "Renvoie l'utilisation d'une commande précise",
  usage: "!helpCommand + nom de la commande"
}