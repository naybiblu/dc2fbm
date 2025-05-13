import * as message from "./message";
import * as payload from "./payload";

export async function mainHandler
(
    event: any,
    sender: string,
    type: string,
) {
    console.log("eventType: " + event[type]["text"])
    const typeObj = event[type];
    const quickReply = typeObj["quick_reply"];

    if (type === "message") {
        if (quickReply) {
            const qreply = payload[quickReply];

            if (qreply === undefined) return false;

            return qreply.run(event, sender);
        } else {
            const chat = typeObj["text"].toLowerCase();
            const firstWord = chat.split(" ")[0];
            const command = message[firstWord];

            if (!isNaN(firstWord) && firstWord.split("").length === 13) return payload.changeAppID.run(event, sender, firstWord);
            if (command === undefined) return false;

            return await command.run(event, sender);
        };
    } else await payload.BotMainMenu.run(event, sender);
    /*} else {
        return false;
    };*/
};

/*export async function reqHandler
(
    event: any,
    type: string,
) {
    console.log("Response!")
    return false;
}

export async function mainHandler
(
    event: any,
    type: string,
) {
    const responses = await resHandler(event, type);

    if (responses) return;

    /*const requests = await reqHandler(event, type);

    if (requests) await menu.run(event, event.sender.id);
};*/