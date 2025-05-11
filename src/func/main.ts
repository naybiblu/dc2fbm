import * as message from "./message";
import * as payload from "./payload";
import { menu } from "./message";

export async function resHandler
(
    event: any,
    type: string
) {
    console.log("eventType: " + event[type]["text"])
    let status: boolean = false;

    if (type === "message") {
        const command = message[event[type]["text"].split(" ")[0].toLowerCase()];

        if (command === undefined) return status = false;
        console.log("command here")
        return status = command.run(event, event.sender.id);
    } else {
        return status = false;
    };

    return status;
};

export async function reqHandler
(
    event: any,
    type: string
) {
    console.log("Response!")
    return false;
}

export async function mainHandler
(
    event: any,
    type: string
) {
    const responses = await resHandler(event, type);

    if (responses) return;

    /*const requests = await reqHandler(event, type);

    if (requests)*/ await menu.run(event, event.sender.id);
};