export class Button {
    type: string;
    title: string;
    payload: string
    url: string;

    constructor () {};

    addTitle
    (
        text: string
    ) {
        this.type = "postback";
        this.title = text;
        return this;
    };

    addId
    (
        text: string
    ) {
        this.payload = text;
        return this;
    };

    addURL
    (
        text: string
    ) {
        this.type = "web_url";
        this.url = text;
        return this;
    };
};

export class QuickReply {
    title: string;
    content_type: string;
    payload: string;
    image_url: string;

    constructor () {
        this.content_type = "text";
    };

    addTitle 
    (
        text: string
    ) {
        this.title = text;
        return this;
    };

    addId 
    (
        text: string
    ) {
        this.payload = text;
        return this;
    };

    addImage
    (
        url: string
    ) {
        this.image_url = url;
        return this;
    };
};

export class Card {
    buttons: any;
    title: string;
    subtitle: string;
    image_url: string;
        
    constructor () {
        this.buttons = [];  
    };

    addTitle 
    (
        text: string
    ) {
        this.title = text;
        return this;
    };

    addDescription 
    (
        text: string
    ) {
        this.subtitle = text;
        return this;
    };

    addImage 
    (
        url: string
    ) {
        this.image_url = url;
        return this;
    };

    addButtons 
    (
        ...buttons: any[]
    ) {
        this.buttons = [ ...buttons ];
        return this;
    };
};

export class ButtonRow {
    attachment: any;

    constructor () {
        this.attachment = {};
        this.attachment.type = "template";
        this.attachment.payload = {};
        this.attachment.payload.template_type = "button";
        this.attachment.payload.buttons = [];
    };

    addText 
    (
        text: string
    ) {
        this.attachment.payload.text = text;
        return this;
    };

    addButtons (
        ...buttons: any[]
    ) {
        this.attachment.payload.buttons = [ ...buttons ];
        return this;
    };
};

export class QRRow {
    quick_replies: any[];
    text: any;
        
    constructor () {
        this.quick_replies = [];
    };

    addText 
    (
        text: string
    ) {
        this.text = text;
        return this;
    };

    addQRs 
    (
        ...qr: any[]
    ) {
        this.quick_replies = [ ...qr ];
        return this;
    };
};

export class CardRow {
    attachment: any;

    constructor () {
        this.attachment = {};
        this.attachment.type = "template";
        this.attachment.payload = {};
        this.attachment.payload.template_type = "generic";
        this.attachment.payload.elements = [];
    };

    addCards 
    (
        ...cards: any[]
    ) {
        this.attachment.payload.elements = [ ...cards ];
        return this;
    };
};