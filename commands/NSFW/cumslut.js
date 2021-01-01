const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();

module.exports = {
  name: "cumslut",
  category: "NSFW",
  usage: "[commande]",
  run: async (client, message, args) => {
  //command

  //Checks channel for nsfw
  var errMessage = "Ce n'est pas un salon NSFW !";
  if (!message.channel.nsfw) {
      message.react('⚠️');

      return message.reply(errMessage)
      .then(msg => {
      msg.delete({ timeout: 3000 })
      })
      
  }

        async function work() {
        let owo = (await neko.nsfw.cumsluts());

        const cumslut = new Discord.MessageEmbed()
        .setTitle("Cumslut")
        .setImage(owo.url)
        .setColor(`#ff0000`)
        .setURL(owo.url);
        message.channel.send(cumslut);

}

      work();
}
                };