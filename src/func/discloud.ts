import axios from "axios";
import {
    goodLog,
    badLog
} from "./misc";

const {
    DC_APITOKEN: token
} = process.env;

export async function checkInfo
(
    appId: string
) {
    const res: any = (await axios(`https://api.discloud.app/v2/app/${appId}`, {
            method: "get",
            headers: {
                "api-token": token
            }
        }
    )).data;

    if (!res.status || res.status !== "ok") return badLog
    (
        "Discloud",
        "Unable to fetch information from App #" + appId
    );

    goodLog
    (
        "Discloud",
        `Fetched information from "${res.apps.name}" bot: ` + JSON.stringify(res, null, 2)
    );
    return res;
};

export async function checkLogs
(
    appId: string
) {
    const res: any = (await axios(`https://api.discloud.app/v2/app/${appId}/logs`, {
            method: "get",
            headers: {
                "api-token": token
            }
        }
    )).data;

    if (!res.status || res.status !== "ok") {
        badLog
        (
            "Discloud",
            "Unable to fetch logs from App #" + appId
        );

        return {
            status: "off"
        };
    }

    goodLog
    (
        "Discloud",
        `Fetched logs from "${res.apps.name}" bot: ` + JSON.stringify(res, null, 2)
    );
    return {
        logs: res.apps.terminal.small,
        status: res.status
    };
};

export async function restartApp
(
    appId: string
) {
    const res: any = await axios(`https://api.discloud.app/v2/app/${appId}/restart`, {
            method: "put",
            headers: {
                "api-token": token
            }
        }
    );

    if (!res.status || res.status !== "ok") return badLog
    (
        "Discloud",
        "Unable to restart App #" + appId
    );

    goodLog
    (
        "Discloud",
        `Restarted "${res.apps.name}" bot: ` + JSON.stringify(res, null, 2)
    );
    return res;
};