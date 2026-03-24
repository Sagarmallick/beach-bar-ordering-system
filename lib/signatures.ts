/**
 * A simple, fast hashing function that works in both browser and node.
 * This is used to generate a "signature" for chair IDs to prevent users 
 * from manually guessing other chair URLs.
 */

const DEFAULT_SECRET = process.env.NEXT_PUBLIC_QR_SECRET || "beach-bar-system-secret"

const hashString = (str: string) => {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
};

export function generateSignature(chairId: string | number, secret?: string): string {
    const raw = `${chairId}-${secret || DEFAULT_SECRET}`;
    return hashString(raw).substring(0, 6);
}

export function verifySignature(chairId: string | number, signature: string, secret?: string): boolean {
    if (!signature) return false;
    const expected = generateSignature(chairId, secret);
    return expected === signature;
}
