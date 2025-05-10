import fetch from 'node-fetch';
import {
    goodLog,
    badLog
} from "./misc";

const {
  FB_ACCESSTOKEN: access, 
  FB_VERIFYTOKEN: verify 
} = process.env;

export function verifyFB
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

    await Promise.all(body.entry.forEach(async (entry: any) => {
        const webhookEvent = entry.messaging[0];
        const sender = webhookEvent.sender.id;
        goodLog
        (
            "FB",
            `Processing a webhook event from ${sender}: ` + JSON.stringify(webhookEvent, null, 2)
        );

        console.log(Object.keys(webhookEvent[3]));
        switch (Object.keys(webhookEvent)[3]) {
            default: await handleMessage(sender, webhookEvent.message)
        };
    }));

    res.status(200).send("Event received!");
};

export async function handleMessage
(
    sender: string, 
    receivedMsg: any
) {
    let response: any;
    const { text } = receivedMsg;

    if (!text) return;
    response = {
        text: `You said: "${text}"`
    };

    await send(sender, response);
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

        const res = await fetch(`https://graph.facebook.com/v22.0/me/messages?access_token=${access}`,
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