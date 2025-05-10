import {
    sendTxt
} from "./messenger";

// request

// response
export const echo = {
    run: async(
        event: any,
        sender: string
    ) => {
        console.log((await sendTxt(sender, event.message.split(" ").shift())));
    }
};

export const hi = {
    run: async(
        event: any,
        sender: string
    ) => {
        await sendTxt(sender, "Hi!");
    }
};