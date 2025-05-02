import { useMemo, useState } from "react";
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

const ITEMS_PER_PAGE = 10;

export function Posts() {
  const locationData: { state: any } = useLocation();

  const [isOpen, setIsOpen] = useState(locationData.state ? true : false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>("");
  const [paginationToken, setPaginationToken] = useState<string | null>(null);
  const [direction, setDirection] = useState<"before" | "after" | null>(null);

  const { data, isLoading } = useGetAllPostsQuery({
    pageSize: ITEMS_PER_PAGE,
    query,
    paginationToken,
    direction,
  });

  const { firstToken, lastToken } = useMemo(() => {
    if (data && data.documents.length >= 1) {
      return {
        firstToken: data.documents[0].paginationToken,
        lastToken: data.documents[data.documents.length - 1].paginationToken,
      };
    }
    return { firstToken: null, lastToken: null };
  }, [data]);

  console.log(firstToken, lastToken, paginationToken);

  const accesstoken = useAppSelector((state) => state.user.access_token);

  function goToNextPage() {
    setPaginationToken(lastToken);
    setDirection("after");
    setPage((previousPage) => previousPage + 1);
  }

  function goToPreviousPage() {
    setPaginationToken(firstToken);
    setDirection("before");
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
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}
