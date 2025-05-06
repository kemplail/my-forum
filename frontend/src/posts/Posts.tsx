import { useState } from "react";
import Title from "../textelements/Title";
import AddPostModal from "../modals/AddPostModal";

import { PlusSmIcon } from "@heroicons/react/solid";
import { useAppSelector } from "src/hooks";
import { Location, useLocation } from "react-router-dom";
import { SearchBar } from "src/searchbar/SearchBar";
import { TextSearchPosts } from "./TextSearchPosts";
import { SemanticSearchPosts } from "./SemanticSearchPosts";
import TriStateToggle, { TriState } from "src/common/TriStateToggle";
import { HybridSearchPosts } from "./HybridSearchPosts";

type SearchMode = "text" | "semantic" | "hybrid";

export function Posts() {
  const locationData: Location = useLocation();

  const [isOpen, setIsOpen] = useState(locationData.state ? true : false);
  const [query, setQuery] = useState<string>("");
  const [searchMode, setSearchMode] = useState<"text" | "semantic" | "hybrid">(
    "text"
  );

  const accesstoken = useAppSelector((state) => state.user.access_token);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onToggle(state: TriState) {
    const searchModes: SearchMode[] = ["text", "semantic", "hybrid"];

    setSearchMode(searchModes[state]);
  }

  function showRightPostsComponent(searchMode: SearchMode, query: string) {
    if (searchMode === "text" || query === "") {
      return <TextSearchPosts query={query} />;
    } else if (searchMode === "semantic") {
      return <SemanticSearchPosts query={query} />;
    } else {
      return <HybridSearchPosts query={query} />;
    }
  }

  return (
    <div className="posts ">
      <div className="flex items-center gap-x-16 mt-4 mb-4">
        <Title>Fil des posts</Title>

        <TriStateToggle label="Méthode de recherche" onToggle={onToggle} />
        <SearchBar onSearch={(query: string) => setQuery(query)} />

        {accesstoken && (
          <button
            onClick={openModal}
            className="whitespace-nowrap ml-auto flex bg-blue-500 hover:bg-blue-700 text-white font-bold rounded h-10 p-2 ml-4"
          >
            <PlusSmIcon className="w-5 h-5" />
            Ajouter un post
          </button>
        )}
      </div>

      {showRightPostsComponent(searchMode, query)}

      <AddPostModal open={isOpen} close={closeModal} />
    </div>
  );
}
