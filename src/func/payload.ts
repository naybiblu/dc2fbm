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
        await sendTxt(sender, event.message);
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