process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const serverAddress = "http://localhost:9001/";

export async function getFriends() {
    let result = undefined
    result = await fetch(serverAddress + 'friends/get')
    result = await Object.values(await result.json());
    return result;
}

export async function getLoot() {
    let result = undefined
    result = await fetch(serverAddress + 'hextech/inventory')
    result = await Object.values(await result.json());
    return result;
}
