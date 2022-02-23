import { axiosBaseQuery } from "../axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react'
import { NbPostsEvolution } from "src/types/nbPostsEvolution";
import { buildQueries } from "@testing-library/react";

export const metricsApi = createApi({
  reducerPath: 'metricsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Comment','Post','LikePost','LikeComment','User'],
  endpoints: (builder) => ({
    getEvolutionNbPosts: builder.query<{data: [string, string|number][], countMax : number }, string>({
        query: (date) => ({
            url: `metrics/user/nbpostsevolution`,
            method: "POST",
            data: {date:date}
          }),
          providesTags: ["Post"],
          transformResponse: (defaultResponse : NbPostsEvolution[]) => {

            let xAxis : (string)[] = [];
            let yAxis : (number)[] = [];
            let response : { data: [string, string|number][], countMax : number } = { data: [["Date","Nombre de posts"]], countMax: 0 };
        
            if(defaultResponse) {
                xAxis = defaultResponse.map((element) => `${element._id.day}-${element._id.month}-${element._id.year}`);
                yAxis = defaultResponse.map((element) => element.count);
        
                for(let i = 0; i < yAxis.length; i++) {
                    response.data.push([xAxis[i],yAxis[i]]);
                }

                response.countMax = Math.max(...yAxis)+1;

            }

            return response;

          }
    }),
    getEvolutionNbLikes: builder.query<{data: [string, string|number][], countMax : number }, string>({
        query: (date) => ({
            url: `metrics/user/nblikesreceivedpostevolution`,
            method: "POST",
            data: {date:date}
          }),
          providesTags: ["LikePost"],
          transformResponse: (defaultResponse : NbPostsEvolution[]) => {

            let xAxis : (string)[] = [];
            let yAxis : (number)[] = [];
            let response : { data: [string, string|number][], countMax : number } = { data: [["Date","Nombre de likes"]], countMax: 0 };
        
            if(defaultResponse) {
                xAxis = defaultResponse.map((element) => `${element._id.day}-${element._id.month}-${element._id.year}`);
                yAxis = defaultResponse.map((element) => element.count);
        
                for(let i = 0; i < yAxis.length; i++) {
                    response.data.push([xAxis[i],yAxis[i]]);
                }

                response.countMax = Math.max(...yAxis)+1;

            }

            return response;

          }
    })
  }),
  
})

export const { useGetEvolutionNbPostsQuery, useGetEvolutionNbLikesQuery } = metricsApi