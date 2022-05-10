import crypto from "crypto";
import { config } from "dotenv";
config();
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN, API_KEY, API_KEY_SECRET } = process.env;
export const nonce = crypto
    .randomBytes(8)
    .toString("base64")
    .replace(/[\W_]+/g, "");
export const timestamp = Math.floor(Date.now() / 1000);
export const options = {
    prefixUrl: "https://api.twitter.com/2/users/",
    headers: { Authorization: `Bearer ${process.env.BEARER}` },
};
export const params = {
    oauth_consumer_key: API_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: ACCESS_TOKEN,
    oauth_version: "1.0",
};
const signingKey = `${API_KEY_SECRET}&${ACCESS_TOKEN_SECRET}`;
const encodedParams = Object.entries(params).map((entry) => entry.map((kv) => encodeURIComponent(kv)).join("="));
const signature = (userId, tweet) => [
    "DELETE",
    encodeURIComponent(`https://api.twitter.com/2/users/${userId}/likes/${tweet}`),
    encodeURIComponent(encodedParams.join("&")),
].join("&");
const oauth_sig = crypto
    .createHmac("sha1", signingKey)
    .update(signature(123, 123))
    .digest()
    .toString("base64");
encodedParams.push(`oauth_signature="${encodeURIComponent(oauth_sig)}"`);
export const Authorization = `OAuth ${encodedParams.join(",")}`;
