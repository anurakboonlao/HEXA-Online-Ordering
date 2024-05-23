export const isJsonString = (stringValue:string) => {
    try {
        JSON.parse(stringValue);
    } catch (e) {
        return false;
    }
    return true;
}