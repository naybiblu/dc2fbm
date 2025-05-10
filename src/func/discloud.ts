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
    const res: any = await axios(`https://api.discloud.app/v2/app/${appId}`, {
            method: "get",
            headers: {
                "api-token": token
            }
        }
    );

    console.log(res.data)
    console.log((await res.data))

    if (!res.status) return badLog
    (
        "Discloud",
        "Unable to fetch information from App #" + appId
    );

    goodLog
    (
        "Discloud",
        `Fetched information from "${res.apps.name}" bot: ` + JSON.stringify(res, null, 2)
    );
    return res();
};

export async function checkLogs
(
    appId: string
) {
    const res: any = await axios(`https://api.discloud.app/v2/app/${appId}/logs`, {
            method: "get",
            headers: {
                "api-token": token
            }
        }
    );
    const { json } = res;

    if (!json().status) return badLog
    (
        "Discloud",
        "Unable to fetch logs from App #" + appId
    );

    goodLog
    (
        "Discloud",
        `Fetched logs from "${json().apps.name}" bot: ` + JSON.stringify(res, null, 2)
    );
    return json().apps.terminal.small;
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
    const { json } = res;


    if (!res.status) return badLog
    (
        "Discloud",
        "Unable to restart App #" + appId
    );

    goodLog
    (
        "Discloud",
        `Restarted "${json().apps.name}" bot: ` + JSON.stringify(res, null, 2)
    );
    return json();
};