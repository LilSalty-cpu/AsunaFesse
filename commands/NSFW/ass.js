const superagent = require("node-fetch");
const Discord = require('discord.js')

const rp = require('request-promise-native');

module.exports = {
    name: "ass",
    category: "NSFW",
  description: "Envoie des fesses",
  run: async (client, message, args, level) => {
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

  return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function(res)  {
    return rp.get({
        url:'http://media.obutts.ru/' + res[0].preview,
        encoding: null
    });
}).then(function(res)   {

const ass = new Discord.MessageEmbed()
      .setTitle("Ass")
      .setColor(`#ff0000`)
      .setImage("attachment://file.png").attachFiles([{ attachment: res, name: "file.png" }])


    message.channel.send(ass);
});
  }
  };