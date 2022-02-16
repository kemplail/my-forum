import { Post } from "./post";
import { User } from "./user";

export type Comment = {
    _id: string,
    text: string,
    date: Date,
    post: Post,
    author: User,
    lastUpdate?: Date
}