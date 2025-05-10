import {
    readdirSync
} from "fs";

const typeArr = {
    message: "text",
    payload: "postback"
};

export async function resHandler
(
    event: any,
    type: string
) {
    const interpreter = typeArr[type];
    const dataCategory = event[interpreter];
    console.log(dataCategory)
    const commandCategory = dataCategory[interpreter === typeArr[1] ? "payload" : interpreter];

    readdirSync(`./processes/messenger/${interpreter}/response`)
        .forEach((file: string) => {
            if (!dataCategory) return;
            if (!commandCategory.includes(file.split(".")[0].toLowerCase())) return;

            const command = import(`./../processes/messenger/${interpreter}/response/${file}`);

            console.log(command)
        }
    );
};