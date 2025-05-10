import {
    readFileSync,
    readdirSync
} from "fs";
import * as message from "./message";
import * as payload from "./payload";
import { menu } from "./message";
import {
    resolve
} from "path";
import { Button } from "../assets/messenger";

/*export async function resHandler
(
    event: any,
    type: string
) {
    const commandCategory = event[type];

     console.log(new Button().addTitle("test"), data)
    console.log(readdirSync("/var/task/src/processes"));

    readdirSync("/var/task/src/processes/messenger")
        .forEach((file: string) => {
            console.log(file)
            if (!event[type].includes(file.split(".")[0].toLowerCase())) return;

            const command: any = import(`./../processes/messenger/${type}/response/${file}`);

            console.log(command)
           
            command.data.run(event, event.sender.id);
        }
    );
};*/

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