import { put, del, list } from '@vercel/blob';
import axios from "axios";

const defaultParams = {
    access: "public",
    allowOverwrite: true
};

export async function create
(
    fileName: string,
    data: any, 
    params?: any
) {
    const blob = await put(fileName, data, params ? params: defaultParams);

    return blob;
};

export async function get
(
    {
        getAll = true
    } : {
        getAll: boolean
    }
) {
    const blobs = await list();

    return getAll ? blobs.blobs : blobs.blobs[0];
};

export async function read
(
    {
        getFirst = true,
        url = ""
    } : {
        getFirst: boolean,
        url?: string
    }
) {
    const firstBlob: any = await get({ getAll: false });
    const firstBlobURL: string = await firstBlob.url;
    console.log(getFirst ? firstBlobURL : url, firstBlob)
    const data = await axios(getFirst ? firstBlobURL : url);

    return JSON.parse(data.data);
};

export async function remove
(
    url: string
) {
    await del(url);
};