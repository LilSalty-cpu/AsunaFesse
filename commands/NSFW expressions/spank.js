const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const utils = require('../../utils');

module.exports = {
  name: "spank",
  category: "NSFW expressions",
  description: "Donne une fessée a un utilisateur",
  usage: "[commande] + [utilisateur]",
  run: async (client, message, args) => {
  //command

  //Checks channel for nsfw
  var errMessage = "Ce n'est pas un channel NSFW";
  if (!message.channel.nsfw) {
      message.react('⚠️');

      return message.reply(errMessage)
      .then(msg => {
      msg.delete({ timeout: 3000 })
      })
      
  }
        const user = message.mentions.users.first();
        if(!user)
        return message.reply("Mentionne quelqu'un pour lui mettre une fessée");

        async function work() {
        let owo = (await neko.nsfw.spank());

        const cuddleembed = new Discord.MessageEmbed()
        .setTitle(user.username + " Tu t'es pris une fessée ")
        .setDescription((user.toString() + " C'est pris une fessée par " + message.author.toString() + "!"))
        .setImage(owo.url)
        .setColor(`#ff0000`)
        .setURL(owo.url);
        message.channel.send(cuddleembed);

}

      work();
}
                }; 