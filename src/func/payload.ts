import {
    reply,
    getSortedMsgs,
    req2API
} from "./messenger";
import {
    getAccurateDate,
    lastElementsOfArr
} from "./misc";
import {
    read,
    create
} from "./blob";
import {
    checkInfo,
    restartApp,
    checkLogs
} from "./discloud";
import { 
    QuickReply,
    QRRow
} from "./../assets/messenger";

// request

// response
export const BotMainMenu = {
    run: async(
        event: any,
        sender: string,
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
                        .addId("MenuLogs")
                        /*.addImage("https://static.vecteezy.com/system/resources/thumbnails/014/551/056/small_2x/eye-icon-simple-flat-eye-design-vision-care-concept-wear-glasses-for-a-clear-vision-png.png")*/,
                    new QuickReply()
                        .addTitle("Restart")
                        .addId("MenuRestart")
                        /*.addImage("https://cdn2.iconfinder.com/data/icons/zoldo-minimal-user-interface/32/power_reset_restart-512.png")*/,
                    new QuickReply()
                        .addTitle("Change ID")
                        .addId("MenuChange")
                        /*.addImage("https://cdn4.iconfinder.com/data/icons/e-mail-messenger-user-interface/100/settings_user_interface_ui_setup_gear-wheel-512.png")*/
                )
        ).catch((e: any) => console.error(e));

        return true;
    }
};

export const MenuLogs = {
    run: async(
        event: any,
        sender: string,
    ) => {
        const { id } = await read({ getFirst: true });
        const logs = await checkLogs(id);

        if (logs.status !== "ok") return await reply(sender,
            new QRRow()
                .addText(`❌ There is no available logs at the moment. Please try again later.`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );

        console.log(logs)

        await reply(sender, 
            new QRRow()
                .addText(`📝 Logs as of ${getAccurateDate("date")} at ${getAccurateDate("time")}:\n\n${lastElementsOfArr(logs.logs.split("\n").slice(), 12).join("\n")}`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );
    }
};

export const MenuRestart = {
    run: async(
        event: any,
        sender: string,
    ) => {
        await reply(sender,
            new QRRow()
                .addText(`❗ You will be restarting the bot.\n\nAre you sure?`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Yes")
                        .addId("MenuRestartYes"),
                    new QuickReply()
                        .addTitle("No")
                        .addId("BotMainMenu")
                )
        );
    }
};

export const MenuRestartYes = {
    run: async(
        event: any,
        sender: string,
    ) => {
        const { id } = await read({ getFirst: true });

        await reply(sender, 
            new QRRow()
                .addText("🔁 Restarting your app...\n\nKindly check the status after one (1) minute.")
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );
        await restartApp(id);
    }
};

export const MenuChange = {
    run: async(
        event: any,
        sender: string,
    ) => {
        await reply(sender, "Please enter your App ID:");
    }
};

export const changeAppID = {
    run: async(
        event: any,
        sender: string,
        appID: string
    ) => {
        const sortedMsgs = await getSortedMsgs(sender, "created_time");
        const secondRecentMsg = (await req2API({
            get: true,
            target: sortedMsgs[1].id,
            params: `fields=id,created_time,message`
        })).data;

        if (!secondRecentMsg.message.toLowerCase().includes("please enter your new app id:")) return;

        await create("data.json", JSON.stringify({
            id: appID,
        }, null, 2));

        await reply(sender,
            new QRRow()
                .addText(`Hooray! 🎉\n\nThe App ID had been changed to "${appID}"!`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );
    }
};