const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const utils = require('../../utils');

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Renvoie toutes les commandes ou une information de commande spécifique",
    usage: "[commande | alias]",
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("#c9c084")
        .setThumbnail("https://media.discordapp.net/attachments/793227895018618890/793227939260006400/4698520064fed229be9e7fe708772844.png?width=468&height=468")
        .setTitle("Menu d'aide")
        .setFooter("Pour voir la description des commandes, tapes '.help' [CMD Name]")
        
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`${cmd.name}\``)
            .join(", ");
    }

    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

        message.reply('Regarde tes DM')

        

    return message.author.send(embed.setDescription(info));
    
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `Aucune information trouvée pour la commande **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("#ff0000").setDescription(info));
    }

    if (cmd.name) info = `**Commande name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Alias**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntaxe: <> = obligatoire, [] = optionel`);
    }

    return message.channel.send(embed.setColor("#ff0000").setDescription(info));
}
