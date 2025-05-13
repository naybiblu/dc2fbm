import {
    reply
} from "./messenger";

// request

// response
export const echo = {
    run: async(
        event: any,
        sender: string,
    ) => { 
        const receivedMsg = event.message.text.split(" ");

        console.log("Echo : " + event)

        await reply(sender, receivedMsg.slice(1, receivedMsg.length).join(" "));

        return true;
    }
};