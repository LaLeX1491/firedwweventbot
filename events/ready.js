const CHANGE_MINUTES = 5;

const activities = [
    { name: "dem Meeting zu", type: 2 },
    { name: "die Schichtpläne durch", type: 3 },
    { name: "die Events an", type: 3 },
    { name: "dem Forum zu", type: 2 },
    { name: "A Gentlemen's Dispute", type: 0 },
]

function updatePresence(client) {
    client.user.setPresence({
        status: "online",
        activities: [activities[Math.floor(Math.random() * activities.length)]],
    });
}

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot online als ${client.user.tag}`);

        updatePresence(client);
        setInterval(() => {
            updatePresence(client);
        }, CHANGE_MINUTES * 60 * 1000)

    },
};