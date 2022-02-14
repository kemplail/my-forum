import { User } from "./user";

export type Post = {

    _id: string,
    title: string,
    text: string,
    author: User

}