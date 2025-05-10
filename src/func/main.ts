import {
    readdirSync
} from "fs";
import {
    resolve
} from "path";

export async function resHandler
(
    event: any,
    type: string
) {
    const commandCategory = event[type];

    console.log(readdirSync("/var/task/src/"));

    readdirSync("/var/task/src/processes/messenger")
        .forEach((file: string) => {
            console.log(file)
            if (!event[type].includes(file.split(".")[0].toLowerCase())) return;

            const command = import(`./../processes/messenger/${type}/response/${file}`);

            console.log(command)
        }
    );
};