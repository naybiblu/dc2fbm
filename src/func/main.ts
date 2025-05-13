import * as message from "./message";
import * as payload from "./payload";
import { menu } from "./message";

export async function resHandler
(
    event: any,
    type: string,
    response: any
) {
    console.log("eventType: " + event[type]["text"])

    if (type === "message") {
        const command = message[event[type]["text"].split(" ")[0].toLowerCase()];

        if (command === undefined) return false;

        return command.run(event, event.sender.id, response);
    } else {
        return false;
    };
};

export async function reqHandler
(
    event: any,
    type: string,
    response: any
) {
    console.log("Response!")
    return false;
}

export async function mainHandler
(
    event: any,
    type: string,
    response: any
) {
    const responses = await resHandler(event, type, response);

    if (responses) return;

    /*const requests = await reqHandler(event, type);

    if (requests)*/ await menu.run(event, event.sender.id, response);
};