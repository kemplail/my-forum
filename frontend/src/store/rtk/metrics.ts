import { axiosBaseQuery } from "../axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react'
import { NbPostsEvolution } from "src/types/nbPostsEvolution";
import { buildQueries } from "@testing-library/react";
import { NbLikesEvolution } from "src/types/nbLikesEvolution";
import { NbPostsPerUser } from "src/types/nbPostsPerUser";
import { emptySplitApi } from "./emptySplitApi";
import { Word } from "react-wordcloud";

export const metricsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvolutionNbPosts: builder.query<{ data: [string, string | number][], countMax: number }, string>({
      query: (date) => ({
        url: `metrics/user/nbpostsevolution`,
        method: "POST",
        data: { date: date }
      }),
      providesTags: ["Post"],
      transformResponse: (defaultResponse: NbPostsEvolution[]) => {

        let xAxis: (string)[] = [];
        let yAxis: (number)[] = [];
        let response: { data: [string, string | number][], countMax: number } = { data: [["Date", "Nombre de posts"]], countMax: 0 };

        if (defaultResponse) {
          xAxis = defaultResponse.map((element) => `${element._id.day}-${element._id.month}-${element._id.year}`);
          yAxis = defaultResponse.map((element) => element.count);

          for (let i = 0; i < yAxis.length; i++) {
            response.data.push([xAxis[i], yAxis[i]]);
          }

          response.countMax = Math.max(...yAxis) + 1;

        }

        return response;

      }
    }),
    getEvolutionNbLikes: builder.query<{ data: [string, string | number][], countMax: number }, string>({
      query: (date) => ({
        url: `metrics/user/nblikesreceivedpostevolution`,
        method: "POST",
        data: { date: date }
      }),
      providesTags: ["LikePost"],
      transformResponse: (defaultResponse: NbLikesEvolution[]) => {

        let xAxis: (string)[] = [];
        let yAxis: (number)[] = [];
        let response: { data: [string, string | number][], countMax: number } = { data: [["Date", "Nombre de likes"]], countMax: 0 };

        if (defaultResponse) {
          xAxis = defaultResponse.map((element) => `${element._id.day}-${element._id.month}-${element._id.year}`);
          yAxis = defaultResponse.map((element) => element.count);

          for (let i = 0; i < yAxis.length; i++) {
            response.data.push([xAxis[i], yAxis[i]]);
          }

          response.countMax = Math.max(...yAxis) + 1;

        }

        console.log(response);

        return response;

      }
    }),
    //getNbPostsPerUser
    getNbPostsPerUser: builder.query<{ data: [string, string | number][] }, void>({
      query: () => ({
        url: `metrics/nbpostsperuser`,
        method: "POST",
      }),
      providesTags: ["Post"],
      transformResponse: (defaultResponse: NbPostsPerUser[]) => {

        let xAxis: (string)[] = [];
        let yAxis: (number)[] = [];
        let response: { data: [string, string | number][] } = { data: [["Username", "Nombre de posts"]] };

        if (defaultResponse) {
          xAxis = defaultResponse.map((element) => element.name);
          yAxis = defaultResponse.map((element) => element.count);

          for (let i = 0; i < yAxis.length; i++) {
            response.data.push([xAxis[i], yAxis[i]]);
          }

        }

        return response;

      }
    }),
    getNbPosts: builder.query<number, string>({
      query: (date) => ({
        url: `metrics/user/nbposts`,
        method: "POST",
        data: { date: date }
      }),
      providesTags: ["Post"]
    }),
    getNbLikesOnPost: builder.query<number, string>({
      query: (date) => ({
        url: `metrics/user/nblikesreceivedposts`,
        method: "POST",
        data: { date: date }
      }),
      providesTags: ["Post", "LikePost"]
    }),
    getNbCommentsReceived: builder.query<number, string>({
      query: (date) => ({
        url: `metrics/user/nbcommentsreceived`,
        method: "POST",
        data: { date: date }
      }),
      providesTags: ["Post", "Comment"]
    }),
    getNbCommentsPosted: builder.query<number, string>({
      query: (date) => ({
        url: `metrics/user/nbcommentsposted`,
        method: "POST",
        data: { date: date }
      }),
      providesTags: ["Post", "Comment"]
    }),
    getWordCloud: builder.query<Word[], void>({
      query: () => ({
        url: 'metrics/wordcloud',
        method: 'GET',
      }),
      providesTags: ["Post"],
      transformResponse: (defaultResponse: Record<string, number>) => {

        let newResponse = Object.keys(defaultResponse).map((key) => ({ text: key, value: defaultResponse[key]*100 }));
        return newResponse;

      }
    }),
  }),

})

export const { useGetEvolutionNbPostsQuery, useGetEvolutionNbLikesQuery, useGetNbPostsPerUserQuery, useGetNbPostsQuery, useGetNbLikesOnPostQuery, useGetNbCommentsReceivedQuery, useGetNbCommentsPostedQuery, useGetWordCloudQuery } = metricsApi