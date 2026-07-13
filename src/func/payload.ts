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
                        .addTitle("Change Settings")
                        .addId("MenuSettings")
                    /*new QuickReply()
                        .addTitle("Change ID")
                        .addId("MenuChange")*/
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
                        .addTitle("Refresh")
                        .addId("MenuLogs"),
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu"),
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

export const MenuSettings = {
    run: async(
        event: any,
        sender: string,
    ) => {
        const current = await read({ getFirst: true });
        await reply(sender,
            new QRRow()
                .addText(`⚙ Current Settings\n\n1️⃣ App ID: ${current?.id}\n\n2️⃣ Development Mode: ${current?.onDevMode ?? "undefined"}` +
                    `3️⃣ Refresh Rate: ${current?.refreshRate ?? "undefined"}\n\n4️⃣ Answering Duration Window: ${current?.answerDuration ?? "undefined"}`
                )
                .addQRs(
                    new QuickReply()
                        .addTitle("Change 1")
                        .addId("ChangeAppID"),
                    new QuickReply()
                        .addTitle("Change 2")
                        .addId("ChangeDevMode"),
                    new QuickReply()
                        .addTitle("Change 3")
                        .addId("ChangeRefRate"),
                    new QuickReply()
                        .addTitle("Change 4")
                        .addId("ChangeAnsDuration")
                )
        );
    }
};

export const ChangeAppID = {
    run: async(
        event: any,
        sender: string,
    ) => {
        await reply(sender, "Please enter your new App ID:");
    }
};

export const changeAppID = {
    run: async(
        event: any,
        sender: string,
        appID: string
    ) => {
        const { id, ...others } = await read({ getFirst: true });

        await create("data.json", JSON.stringify({
            id: appID,
            ...others
        }, null, 2));

        await reply(sender,
            new QRRow()
                .addText(`Hooray! 🎉\n\nThe App ID has been changed to "${appID}"!`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );
    }
};

export const ChangeDevMode = {
    run: async(
        event: any,
        sender: string,
    ) => {
        const { onDevMode, ...others } = await read({ getFirst: true });
        const result = !onDevMode;

        await create("data.json", JSON.stringify({
            onDevMode: result,
            ...others
        }, null, 2));

        await reply(sender, `Hooray! 🎉\n\nThe Development Mode has been turned ${result}`);
    }
};

export const ChangeRefRate = {
    run: async(
        event: any,
        sender: string,
    ) => {
        await reply(sender, "Please enter your preferred refresh rate:");
    }
};

export const changeRefRate = {
    run: async(
        event: any,
        sender: string,
        refreshInterval: string
    ) => {
        const { refreshRate, ...others } = await read({ getFirst: true });
        
        await create("data.json", JSON.stringify({
            refreshRate: refreshInterval,
            ...others
        }, null, 2));

        await reply(sender,
            new QRRow()
                .addText(`Hooray! 🎉\n\nThe Refresh Rate has been changed to "${refreshInterval}"!`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );
    }
};

export const ChangeAnsDuration = {
    run: async(
        event: any,
        sender: string,
    ) => {
        await reply(sender, "Please enter your preferred answer duration window:");
    }
};

export const changeAnsDuration = {
    run: async(
        event: any,
        sender: string,
        answerWindow: string
    ) => {
        const { answerDuration, ...others } = await read({ getFirst: true });
        
        await create("data.json", JSON.stringify({
            answerDuration: answerWindow,
            ...others
        }, null, 2));

        await reply(sender,
            new QRRow()
                .addText(`Hooray! 🎉\n\nThe Answer Duration Window has been changed to "${answerWindow}"!`)
                .addQRs(
                    new QuickReply()
                        .addTitle("Menu")
                        .addId("BotMainMenu")
                )
        );
    }
};