const randomPuppy = require('random-puppy');
const request = require('node-fetch');
const fs = require("fs")

const Discord = require('discord.js');
const booru = require('booru');

module.exports = {
    name: "r34",
    category: "NSFW",
  description: "Cherche Rule34",
  run: async (bot, message, args, level) => {
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

  if (message.content.toUpperCase().includes('CACA') || message.content.toUpperCase().includes('GORE')) return message.channel.send("Ce genre de choses n'est pas autorisé! Pas même dans les chaînes NSFW!");

  var query = message.content.split(/\s+/g).slice(1).join(" ");
  booru.search('rule34', [query], {nsfw: true, limit: 1, random: true })
      .then(booru.commonfy)
      .then(images => {
          for (let image of images) {
              const embed = new Discord.MessageEmbed()
              .setTitle("Rule34:")
              .setImage(image.common.file_url)
              .setColor('#ff0000')
              .setFooter(`Tags: r34 ${query}`)
              .setURL(image.common.file_url);
          return message.channel.send({ embed });
          }

      }).catch(err => {
          if (err.name === 'booruError') {
              return message.channel.send(`Pas de résultats pour **${query}**!`);
          } else {
              return message.channel.send(`Pas résultats pour **${query}**!`);
          }
})
  }
  };