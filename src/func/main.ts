import { isNumber } from "util";
import * as message from "./message";
import * as payload from "./payload";
import { checkWithSecondMsg } from "./messenger";

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
            const qreply = payload[quickReply.payload];

            if (qreply === undefined) return payload.BotMainMenu.run(event, sender);

            return qreply.run(event, sender);
        } else {
            const chat = typeObj["text"].toLowerCase();
            const firstWord = chat.split(" ")[0];
            const command = message[firstWord];
            const check4AppID = await checkWithSecondMsg(sender, "please enter your new app id:");
            const check4RefRate = await checkWithSecondMsg(sender, "please enter your preferred refresh rate:");
            const check4AnsDuration = await checkWithSecondMsg(sender, "please enter your preferred answer duration window:");

            if (!isNaN(firstWord) && firstWord.split("").length === 13 && check4AppID) return payload.changeAppID.run(event, sender, firstWord);
            if (!isNaN(firstWord) && check4RefRate) return payload.changeRefRate.run(event, sender, firstWord);
            if (!isNaN(firstWord) && check4AnsDuration) return payload.changeAnsDuration.run(event, sender, firstWord);

            if (command === undefined) return payload.BotMainMenu.run(event, sender);

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