import { useState } from "react";
import { PostElement } from "./PostElement";
import Title from "../textelements/Title";
import AddPostModal from "../modals/AddPostModal";
import { Post } from "../types/post";
import { useGetAllPostsQuery } from "../store/rtk/post";

import { PlusSmIcon } from "@heroicons/react/solid";
import { useAppSelector } from "src/hooks";
import { useLocation } from "react-router-dom";
import { PaginationBar } from "src/paginationbar/PaginationBar";
import { SearchBar } from "src/searchbar/SearchBar";

export function Posts() {
  const locationData: { state: any } = useLocation();

  const [isOpen, setIsOpen] = useState(locationData.state ? true : false);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetAllPostsQuery({
    page,
    pageSize: 10,
    ...(query ? { query } : {}),
  });

  const accesstoken = useAppSelector((state) => state.user.access_token);

  function goToNextPage() {
    setPage((previousPage) => previousPage + 1);
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(prev - 1, 1));
  }

  function showPosts() {
    return data?.documents.map((element: Post) => {
      return <PostElement key={element._id} post={element} />;
    });
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="posts ">
      <div className="flex">
        <Title>Fil des posts</Title>

        <SearchBar onSearch={(query: string) => setQuery(query)} />

        {accesstoken && (
          <button
            onClick={openModal}
            className="whitespace-nowrap mt-4 ml-auto flex bg-blue-500 hover:bg-blue-700 text-white font-bold rounded h-10 p-2 ml-4"
          >
            <PlusSmIcon className="w-5 h-5" />
            Ajouter un post
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {!isLoading ? showPosts() : <span>Loading...</span>}
      </div>

      <AddPostModal open={isOpen} close={closeModal} />

      <PaginationBar
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        page={page}
        totalCount={data?.meta.totalCount}
        dataIsLoading={isLoading}
      />
    </div>
  );
}
