const config = require("../config.json");
/*
If you want to make discord-economy guild based you have to use message.author.id + message.guild.id as ID for example:
eco.Daily(message.author.id + message.guild.id)
 
This will create a unique ID for each guild member
*/
 
 
//Requiring Packages
const Discord = require('discord.js'); //This can also be discord.js-commando or other node based packages!
const eco = require("discord-economy");
 
//Create the bot client
const client = new Discord.Client();
 
//Set the prefix and token of the bot.
const settings = {
  prefix: (config.prefix),
}
 
//Whenever someone types a message this gets activated.
//(If you use 'await' in your functions make sure you put async here)
client.on('message', async message => {
 
  //This reads the first part of your message behind your prefix to see which command you want to use.
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  //These are the arguments behind the commands.
  var args = message.content.split(' ').slice(1);
 
  //If the message does not start with your prefix return.
  //If the user that types a message is a bot account return.
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'balance') {
 
    var output = await eco.FetchBalance(message.author.id)
    message.channel.send(`Hey ${message.author.tag}! Tu as ${output.balance} pièces.`);
  }
 
  if (command === 'daily') {
 
    var output = await eco.Daily(message.author.id)
    //output.updated will tell you if the user already claimed his/her daily yes or no.
 
    if (output.updated) {
 
      var profile = await eco.AddToBalance(message.author.id, 100)
      message.reply(`Vous avez récupéré vos pièces quotidiennes avec succès! Tu as maintenant ${profile.newbalance} pièces.`);
 
    } else {
      message.channel.send(`Désolé, tu as déja réclamé tes pieces quotidienne\nMais ne t'en fais pas, dans ${output.timetowait} tu pourra les récupérer`)
    }
 
  }
 
  if (command === 'leaderboard') {
 
    //If you use discord-economy guild based you can use the filter() function to only allow the database within your guild
    //(message.author.id + message.guild.id) can be your way to store guild based id's
    //filter: x => x.userid.endsWith(message.guild.id)
 
    //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
    if (message.mentions.users.first()) {
 
      var output = await eco.Leaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`L'utilisateur ${message.mentions.users.first().tag} est numéro ${output} dans le leaderboard`);
 
    } else {
 
      eco.Leaderboard({
        limit: 3, //Only takes top 3 ( Totally Optional )
        filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
      }).then(async users => { //make sure it is async
 
        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
 
        message.channel.send(`My Global leaderboard:
 
1 - ${firstplace && firstplace.tag || 'Personne encore'} : ${users[0] && users[0].balance || 'None'}
2 - ${secondplace && secondplace.tag || 'Personne encore'} : ${users[1] && users[1].balance || 'None'}
3 - ${thirdplace && thirdplace.tag || 'Personne encore'} : ${users[2] && users[2].balance || 'None'}`)
 
      })
 
    }
  }
 
  if (command === 'transfer') {
 
    var user = message.mentions.users.first()
    var amount = args[1]
 
    if (!user) return message.reply("Répondez à l'utilisateur auquel vous souhaitez envoyer de l'argent!")
    if (!amount) return message.reply('Spécifier le montant que vous voulez transferer !')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply("Tu n'as pas asser d'argent")
 
    var transfer = await eco.Transfer(message.author.id, user.id, amount)
    message.reply(`Le transfere a été éffectué!\nBalance de ${message.author.tag}: ${transfer.FromUser}\nBalance de ${user.tag}: ${transfer.ToUser}`);
  }
 
  if (command === 'coinflip') {
 
    var flip = args[0] //Heads or Tails
    var amount = args[1] //Coins to gamble
 
    if (!flip || !['pile', 'face'].includes(flip)) return message.reply('Tu dois spécifier, pile ou face')
    if (!amount) return message.reply('Tu dois miser une somme de pièce')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply("Tu n'as pas assez de pièces!")
 
    var gamble = await eco.Coinflip(message.author.id, flip, amount).catch(console.error)
    message.reply(`Tu as ${gamble.output}! Nouvelle balance: ${gamble.newbalance}`)
 
  }
 
  if (command === 'dice') {
 
    var roll = args[0] //Should be a number between 1 and 6
    var amount = args[1] //Coins to gamble
 
    if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('Tu dois choisir un nombre entre 1 et 6')
    if (!amount) return message.reply('Tu dois miser une somme de pièce')
 
    var output = eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply("Tu n'as pas assez de pièces!")
 
    var gamble = await eco.Dice(message.author.id, roll, amount).catch(console.error)
    message.reply(`Le des affiche ${gamble.dice}. Donc tu as ${gamble.output}! Nouvelle balance: ${gamble.newbalance}`)
 
  }
 
  if (command === 'work') { //I made 2 examples for this command! Both versions will work!
 
    var output = await eco.Work(message.author.id)
    //50% chance to fail and earn nothing. You earn between 1-100 coins. And you get one out of 20 random jobs.
    if (output.earned == 0) return message.reply("Tu n'as pas bien travailler, tu gagnes 0 pièces")
    message.channel.send(`${message.author.username}
Tu as travailler en tant que \` ${output.job} \` et tu as gagner ${output.earned} pièces
Tu as donc maintenant ${output.balance} pièces`)
 
 
    var output = await eco.Work(message.author.id, {
      failurerate: 30,
      money: Math.floor(Math.random() * 500),
      jobs: ['Caissier', 'Employer de Magasin', 'Strip-Teaseur', 'manageur', 'barman', 'pornstar']
    })
    //10% chance to fail and earn nothing. You earn between 1-500 coins. And you get one of those 3 random jobs.
    if (output.earned == 0) return message.reply("Tu n'as pas bien travailler, tu gagnes 0 pièces")
 
    message.channel.send(`${message.author.username}
Tu as travailler en tant que \` ${output.job} \` et tu as gagner ${output.earned} pièces
Tu as donc maintenant ${output.balance} pièces`)
 
  }
 
  if (command === 'slots') {
 
    var amount = args[0] //Coins to gamble
 
    if (!amount) return message.reply('Tu dois miser une somme de pièce')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply("Tu n'as pas assez de pièces")
 
    var gamble = await eco.Slots(message.author.id, amount, {
      width: 3,
      height: 1
    }).catch(console.error)
    message.channel.send(gamble.grid)//Grid checks for a 100% match vertical or horizontal.
    message.reply(`Tu as ${gamble.output}! Nouvelle balance: ${gamble.newbalance}`)
 
  }
 
});
 
//Your secret token to log the bot in. (never show this to anyone!)
client.login(config.token)