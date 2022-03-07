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

export async function getLootOptions(lootId) {
    let result = undefined
    result = await fetch(serverAddress + 'hextech/loot/options?lootId=' + lootId)
    result = await Object.values(await result.json());
    return result;
}

export async function getLootRecipe(lootId) {
    let result = undefined
    result = await fetch(serverAddress + 'hextech/loot/recipe?lootId=' + lootId)
    result = await Object.values(await result.json());
    return result;
}

export async function craftLoot(recipeId, lootIdsJsonArray) {
    let result = undefined
    //Url Encode the lootIdsJsonArray
    let lootIds = encodeURIComponent(lootIdsJsonArray);
    result = await fetch(serverAddress + 'hextech/loot/craft?recipeId=' + recipeId + '&lootIds=' + lootIds)
    result = await Object.values(await result.json());
    return result;
}



