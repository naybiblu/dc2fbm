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
        console.log(receivedMsg.slice(1, receivedMsg.length))
        await sendTxt(sender, receivedMsg.slice(1, receivedMsg.length).join(" "));
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