const TRILLIUM_URL = 'https://maps.trilliumtransit.com/gtfsmap-realtime/feed/ccta-vt-us/arrivals?stopCode=805574&stopID=805574';

// {
//     "status": "success",
//     "data": [
//         {
//             "route_id": "19140",
//             "isPrediction": true,
//             "unixTime": 1769448692,
//             "arrivalTime": "2026-01-26T12:31:32-05:00",
//             "formattedTime": "12:31pm"
//         }
//     ]
// }
export type TrilliumResponse = {
    status: string;
    data: {
        route_id: string;
        isPrediction: boolean;
        unixTime: number;
        arrivalTime: string;
        formattedTime: string;
    }[];
};

export async function getTrilliumData(): Promise<TrilliumResponse> {
    const response = await fetch(TRILLIUM_URL);
    const data = await response.json();
    return data;
}
