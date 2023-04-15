import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  tagTypes: ["Post", "Comment", "Like", "LikePost", "LikeComment", "User"],
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});
