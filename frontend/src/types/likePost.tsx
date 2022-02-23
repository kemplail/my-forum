import { Post } from "./post";
import { User } from "./user";

export type LikePost = {
    _id: string,
    post: Post,
    user: User,
    date: Date
}