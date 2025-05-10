import {
    readdirSync
} from "fs";

export async function resHandler
(
    event: any,
    type: string
) {
    const commandCategory = event[type];

    readdirSync(`./processes/messenger/${type}/response`)
        .forEach((file: string) => {
            if (!commandCategory.includes(file.split(".")[0].toLowerCase())) return;

            const command = import(`./../processes/messenger/${type}/response/${file}`);

            console.log(command)
        }
    );
};