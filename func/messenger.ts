import fetch from 'node-fetch';
import {
    goodLog,
    badLog,
    sortToNewest
} from "./misc";

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

    if (body.object !== "page") return;

    body.entry.forEach(async (entry: any) => {
        entry.messaging.forEach(async (event: any) => {
            const sender = event.sender.id;
            goodLog
            (
                "FB",
                `Processing a webhook event from ${sender}: ` + JSON.stringify(event, null, 2)
            );

            console.log(Object.keys(event)[3]);
            switch (Object.keys(event)[3]) {
                default: await handleMessage(sender, event.message, res)
            };
        });
    });
};

export async function handleMessage
(
    sender: string, 
    receivedMsg: any,
    res: any
) {
    let response: any;
    const { text } = receivedMsg;

    await sendTxt(sender, `You said: "${text}"`);
    res.status(200);
};

export async function send
(
    sender: string, 
    payload: any
) {
    const body = {
        recipient: {
            id: sender,
        },
        message: payload
    };

    try {
        goodLog
        (
            "FB",
            `Sending a message payload to ${sender}: ` + JSON.stringify(body, null, 2)
        );

        const res = await fetch(`https://graph.facebook.com/v22.0/${devId}/messages?access_token=${access}`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            }
        );

        const { json } = res;

        if (res.ok) return goodLog
        (
            "FB",
            "Sent a message: " + JSON.stringify((await json()), null, 2)
        );

        badLog
        (
            "FB",
            `Failed to send a message due to ${res.status} ${res.statusText}: ` + JSON.stringify((await json()), null, 2)
        )
        

    } catch (e) {
        badLog
        (
            "FB",
            "Unable to send a message: ",
            e
        );
    };   
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

    await req2API({ data: data });
};

export async function sendAction
(
    { 
        sender, 
        action = 0
    } : { 
        sender: string, 
        action: number 
    }
) {
    let interpretation: string;
    switch (action) {
        case 1: interpretation = "mark_seen"; break;
        case 2: interpretation = "typing_on"; break;
        default: interpretation = "typing_off";
    };

    req2API({ data: {
        recipient: {
        id: sender.toString()
        },
        sender_action: interpretation
        } 
    });
};

export async function getStarted() {
    req2API({
        data: {
        get_started: {
            payload: "newbie"
        }
        },
        path: "messenger_profile",
        id: "me"
    });
};

export async function reply
(
    {
        sender, 
        content, 
        time = (content.length / 200) * 10000
    } : {
        sender: string,
        content: any,
        time: number
    }
) {
    await sendAction({ sender: sender, action: 1});
    await sendAction({ sender: sender, action: 2});
    
    setTimeout(async () => {
        
        await sendAction({ sender: sender, action: 0});
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

    return data.data.data;
};

export async function getAllMsgs
(
    { 
        convoID, 
        filter = pageId
    } : {
        convoID: string,
        filter: any
    }
) {
    let data: any = await req2API({
        get: true,
        target: convoID,
        params: `fields=messages{id,created_time,from}`
    });
    
    return data.data.messages.data.filter((d: any) => d.from.id === filter);
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

    return data.data;
};

export async function req2API
(
    { 
        data, 
        path = "messages", 
        get = false, 
        params = undefined, 
        target = undefined, 
        id = devId
    } : {
        data?: any,
        path?: string,
        get?: boolean,
        params?: any,
        target?: any,
        id?: string
    }
) {
    if (get) return fetch(`https://graph.facebook.com/v${v}/${target}?${params}&access_token=${access}`);
        
    else fetch(`https://graph.facebook.com/v${v}/${id}/${path}?access_token=${access}`,
        {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            }, 
            body: data
    });
};