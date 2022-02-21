import { User } from "./user";

export type LikeComment = {
    _id: string,
    comment: Comment,
    user: User
}