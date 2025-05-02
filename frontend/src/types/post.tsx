import { LikePost } from "./likePost";
import { Pagination } from "./metadata";
import { User } from "./user";

export type Post = {
  _id: string;
  title: string;
  text: string;
  date: string;
  lastUpdate: Date;
  author: User;
  likes: LikePost[];
};

export type PaginatedPosts = {
  documents: Post[];
  meta: Pagination;
};
