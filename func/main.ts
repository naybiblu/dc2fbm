import {
    readdirSync
} from "fs";

export async function resHandler
(
    event: any,
    type: string
) {
    const commandCategory = event[type];

    readdirSync(`__dir`)
        .forEach((file: string) => {
            console.log(file)
            if (!event[type].includes(file.split(".")[0].toLowerCase())) return;

            const command = import(`./../processes/messenger/${type}/response/${file}`);

            console.log(command)
        }
    );
};