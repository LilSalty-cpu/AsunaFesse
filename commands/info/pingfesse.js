module.exports = {
    name: "ping",
	aliases: ["latence"],
    category: "info",
    description: "Réponds avec le temps de réponse de l'API",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Ping...`);

        msg.edit(`🏓 Pong!
        Temps de réponse de l'API ${Math.round(client.ws.ping)}ms`);
    }
}
