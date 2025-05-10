import {
    sendTxt
} from "../../../../messenger"

export const data = {
    name: "echo",
    run: async(
        event: any,
        sender: string
    ) => {
        await sendTxt(sender, event.message);
    }
};