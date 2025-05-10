import { put, del } from '@vercel/blob';
import { access } from 'fs';

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

export async function remove
(
    url: string
) {
    await del(url);
};