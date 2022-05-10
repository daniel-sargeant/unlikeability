import { config } from "dotenv";
import got from "got";
import { options } from "./utils.js";
config();
const id = await got(`by/username/${process.env.USERNAME}`, options).then((res) => JSON.parse(res.body).data.id);
const tweets = await got(`${id}/liked_tweets`, options).then((res) => JSON.parse(res.body));
console.log(tweets);
