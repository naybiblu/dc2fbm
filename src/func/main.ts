import {
    readFileSync,
    readdirSync
} from "fs";
import * as message from "./message";
import * as payload from "./payload";
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
    console.log(event[type]["text"])
    switch (type) {
        case "message": message[event[type]["text"].split(" ")[0].toLowerCase()].run(event, event.sender.id);
        case "payload": console.log(event[type])
    }
};