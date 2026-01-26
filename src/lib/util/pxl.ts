//https://pxl.hackclub.com/api/pixels/get

export async function getPxlData(): Promise<PxlResponse> {
    const response = await fetch('https://pxl.hackclub.com/api/pixels/get');
    const data = await response.json();
    return data;
}

export type PxlResponse = [
    {
        width: number;
        height: number;
        generated_at: number;
    },
    {
        x: number;
        y: number;
        color: string;
    }[]
];
/*
[
{"width":512,"height":512,"generated_at":1769463875352},
[
{"x":0,"y":0,"color":"#000000"},
...
]
*/

