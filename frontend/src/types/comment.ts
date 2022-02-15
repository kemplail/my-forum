import { Post } from "./post";
import { User } from "./user";

export type Comment = {
    text: string,
    date: Date,
    post: Post,
    author: User,
    lastUpdate?: Date
}