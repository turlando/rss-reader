export function q(...xs: string[]) { return xs.join("\n") }


export function getHeaderValue(
    v: string | string[] | undefined
): string | undefined {
    if (typeof v == "object") return v[0]  // Discriminate string[] case
    if (typeof v == "string") return v     // Distriminate string case
    return undefined                       // Discriminate undefined case
}
