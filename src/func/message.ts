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
        const receivedMsg = event.message.text.split(" ");
        await sendTxt(sender, receivedMsg.slice(1, receivedMsg.length));
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