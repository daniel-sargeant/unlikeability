import { config } from "dotenv";
import crypto from "crypto";
import got from "got";
import { options, encodedParams, signingKey } from "./utils.js";

config();

const id = await got(`by/username/${process.env.USERNAME}`, options).then(
  (res) => JSON.parse(res.body).data.id
);

const tweets = await got(`${id}/liked_tweets`, options).then((res) =>
  JSON.parse(res.body)
);

const signature = (userId, tweet) =>
  [
    "DELETE",
    encodeURIComponent(`${options.prefixUrl}${userId}/likes/${tweet}`),
    encodeURIComponent(encodedParams.join("&")),
  ].join("&");

const oauthSignature = crypto
  .createHmac("sha1", signingKey)
  .update(signature(id, tweets.data[0].id))
  .digest()
  .toString("base64");

encodedParams.push(`oauth_signature="${encodeURIComponent(oauthSignature)}"`);

export const Authorization = `OAuth ${encodedParams.join(",")}`;

const deleteTweet = await got.delete(`${id}/likes/${tweets.data[0].id}`, {
  headers: { Authorization },
  prefixUrl: options.prefixUrl,
});

console.log(JSON.parse(deleteTweet.body));
