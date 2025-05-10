import {
    sendTxt,
    reply
} from "./messenger";
import {
    getAccurateDate
} from "./misc";
import {
    read
} from "./blob";
import {
    checkInfo
} from "./discloud";
import { 
    QuickReply,
    QRRow
} from "./../assets/messenger";

// request

// response
export const echo = {
    run: async(
        event: any,
        sender: string
    ) => { 
        const receivedMsg = event.message.text.split(" ");

        await reply(sender, receivedMsg.slice(1, receivedMsg.length).join(" "));

        return true;
    }
};

export const menu = {
    run: async(
        event: any,
        sender: string
    ) => {
        const { id } = await read({ getFirst: true });
        const { apps } = await checkInfo(id);

        await reply(sender,
            new QRRow()
                .addText(`Good ${getAccurateDate("state").en}, Nyvhie! 👋\n\n` +
                    `Your "${apps.name}" bot is ${apps.online ? "🟢 Online!" : " unfortunately 🔴 Offline..."}\n\n` +
                    `What can I do for you in terms of handling your bot? 🤔`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Check logs")
                        .addId("MenuLo")
                        .addImage("https://static.vecteezy.com/system/resources/thumbnails/014/551/056/small_2x/eye-icon-simple-flat-eye-design-vision-care-concept-wear-glasses-for-a-clear-vision-png.png"),
                    apps.online ? new QuickReply()
                        .addTitle("Restart")
                        .addId("MenuRe")
                        .addImage("https://cdn2.iconfinder.com/data/icons/zoldo-minimal-user-interface/32/power_reset_restart-512.png") : undefined,
                    new QuickReply()
                        .addTitle("Change ID")
                        .addId("MenuCh")
                        .addImage("https://cdn4.iconfinder.com/data/icons/e-mail-messenger-user-interface/100/settings_user_interface_ui_setup_gear-wheel-512.png")
                )
        );
    }
};