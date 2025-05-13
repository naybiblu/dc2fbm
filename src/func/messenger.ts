import axios from 'axios';
import { 
    create,
    get,
    read
} from "./blob";
import {
    goodLog,
    badLog,
    sortToNewest
} from "./misc";
import {
    mainHandler
} from "./main";
const {
  FB_ACCESSTOKEN: access, 
  FB_VERIFYTOKEN: verify,
  FB_DEVID: devId,
  FB_PAGEID: pageId,
  FB_VERSION: v
} = process.env;

export async function verifyFB
(
    req: any,
    res: any
) {
    if (req.method !== "GET") return;

    goodLog
    (
        "FB",
        "Received GET request for webhook verification."
    );

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (!mode && !token || 
        mode !== "subscribe" && token !== verify) {
            res.status(403);
            return badLog
            (
                "FB", 
                "Failed validation. Make sure the verify tokens match."
            );
        };


    res.status(200).send(challenge);
    goodLog
    (
        "FB",
        "Subscribed to the webhook!"
    );
};

export async function FBhandler
(
    req: any,
    res: any
) {
    if (req.method !== "POST") return;
    
    const body = req.body;

    goodLog
    (
        "FB",
        "Received POST request with body: " + JSON.stringify(body, null, 2)
    );

    if (body.object !== "page") return res.status(403).send("Invalid request!");

    body.entry.forEach(async (entry: any) => {
        const event = entry.messaging[0];
        const sender = event.sender.id;

        if (sender === pageId) return res.status(200).send("Bot reponse rejected for request!");

        goodLog
        (
            "FB",
            `Processing a webhook event from ${sender}: ` + JSON.stringify(event, null, 2)
        );

        console.log("eventType: " + Object.keys(event)[3]);
        await mainHandler(event, Object.keys(event)[3]);
        //await handleMessage(event.sender.id, event.message);
        res.status(200).send("Event handled!");
        //return setTimeout(async() => { res.status(200).send("Event handled!") }, 50000);
    });
};

export async function handleMessage
(
    sender: string, 
    receivedMsg: any,
) {
    let response: any;
    const { text } = receivedMsg;

    if (text.startsWith("hi")) {
        const data = {
            id: text.split(" ")[1],
        };
        const blob = await create("data.json", JSON.stringify(data, null, 2));
        const acqBlob = await read({ getFirst: true });

        await sendTxt(sender, "yes");

        goodLog
        (
            "Vercel",
            "Blob uploaded: " + blob
        );
    } else await sendTxt(sender, text);

    return response;
};

export async function sendTxt
(
    sender: string, 
    content: any
) {
    const data = {
        recipient: {
        id: sender.toString()
        },
        messaging_type: typeof content !== "string" && content.attachment?.payload?.template_type === "generic" ? undefined : "RESPONSE",
        message: typeof content === "string" ? {
        text: content,
        } : content
    };

    const response = await req2API({ data: data });
    
    return response.status;
};

type sAConfig = {
    action: number
};
const defaultSAV: sAConfig = {
    action: 0
};
export async function sendAction
(
    sender: string,
    config?: Partial<sAConfig>
) {
    const { action } = { ...defaultSAV, ...config };
    let interpretation: string;
    switch (action) {
        case 1: interpretation = "mark_seen"; break;
        case 2: interpretation = "typing_on"; break;
        default: interpretation = "typing_off";
    };

    const response = await req2API({ data: {
        recipient: {
            id: sender.toString()
        },
            sender_action: interpretation
        } 
    });

    return response.status;
};

export async function getStarted() {
    const response = await req2API({
        data: {
        get_started: {
            payload: "newbie"
        }
        },
        path: "messenger_profile",
        id: "me"
    });

    return response.status;
};

type repConfig = {
    time: number
};
const defaultRepV: repConfig = {
    time: 5000
};
export async function reply
(
    sender: string,
    content: any,
    config?: Partial<repConfig>
) {
    const { time } = { ...defaultRepV, ...config };

    await sendAction(sender, { action: 1 });
    await sendAction(sender, { action: 2 });
    
    setTimeout(async () => {
        
        await sendAction(sender);
        await sendTxt(sender, content);
        
    }, time);
};

export async function getConvo
(
    userID: string
){
    const data: any = await req2API({
        get: true,
        target: `${pageId}/conversations`,
        params: `platform=messenger&user-id=${userID}`
    });

    return {
        data: data.data.data,
        status: data.status
    };
};

type gAMConfig = {
    filter: any
};
const defaultGAMV: gAMConfig = {
    filter: pageId
};
export async function getAllMsgs
(
    convoID: string,
    config?: Partial<gAMConfig>
) {
    const { filter } = { ...defaultGAMV, ...config };

    let data: any = await req2API({
        get: true,
        target: convoID,
        params: `fields=messages{id,created_time,from}`
    });
    
    return {
        data: data.data.messages.data.filter((d: any) => d.from.id === filter),
        status: data.status
    };
};

export async function getRecentMsg
(
    msgs: any, 
    timeField: any
) {
    if (msgs.length < 0) return null;
    
    const recentMsg = await sortToNewest(msgs, timeField)[0];
    const data: any = await req2API({
        get: true,
        target: recentMsg.id,
        params: `fields=id,created_time,message`
    });

    return { 
        data: data.data,
        status: data.status
    };
};

export async function req2API
(
    { 
        data, 
        path = "messages", 
        get = false, 
        params = undefined, 
        target = undefined, 
        id = pageId
    } : {
        data?: any,
        path?: string,
        get?: boolean,
        params?: any,
        target?: any,
        id?: string
    }
) {
    let response: any;

    if (get) return response = await axios(`https://graph.facebook.com/v${v}/${target}?${params}&access_token=${access}`);
    else response = await axios(`https://graph.facebook.com/v${v}/${id}/${path}?access_token=${access}`,
        {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            }, 
            data: data
        }
    );

    if (response.status === 200) goodLog
    (
        "FB",
        `${get ? "GET": "POST"} request granted: ` + JSON.stringify((await response.data), null, 2)
    );
    else badLog 
    (
        "FB",
        `${get ? "GET": "POST"} request denied due to ${response.status} ${response.statusText}: ` + + JSON.stringify((await response.data), null, 2)
    );

    return response;
};