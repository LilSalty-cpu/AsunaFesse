const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();

module.exports = {
  name: "nekogif",
  category: "NSFW",
  description: "Envoie un random Neko Gif",
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
        let owo = (await neko.nsfw.nekoGif());

        const lewdnekogif = new Discord.MessageEmbed()
        .setTitle("NSFW Neko Gif")
        .setImage(owo.url)
        .setColor(`#ff0000`)
        .setURL(owo.url);
        message.channel.send(lewdnekogif);

}

      work();
}
                };