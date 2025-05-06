import { useState } from "react";
import Title from "../textelements/Title";
import AddPostModal from "../modals/AddPostModal";

import { PlusSmIcon } from "@heroicons/react/solid";
import { useAppSelector } from "src/hooks";
import { Location, useLocation } from "react-router-dom";
import { SearchBar } from "src/searchbar/SearchBar";
import { TextSearchPosts } from "./TextSearchPosts";
import ToggleButton from "src/common/ToggleButton";
import { SemanticSearchPosts } from "./SemanticSearchPosts";

export function Posts() {
  const locationData: Location = useLocation();

  const [isOpen, setIsOpen] = useState(locationData.state ? true : false);
  const [query, setQuery] = useState<string>("");
  const [searchMode, setSearchMode] = useState<"text" | "semantic">("text");

  const accesstoken = useAppSelector((state) => state.user.access_token);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onToggle(isToggled: boolean) {
    if (isToggled) {
      setSearchMode("semantic");
    } else {
      setSearchMode("text");
    }
  }

  return (
    <div className="posts ">
      <div className="flex items-center gap-x-16 mt-4 mb-4">
        <Title>Fil des posts</Title>

        <ToggleButton label="Recherche sémantique" onToggle={onToggle} />
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

      {searchMode === "text" || query === "" ? (
        <TextSearchPosts query={query} />
      ) : (
        <SemanticSearchPosts query={query} />
      )}

      <AddPostModal open={isOpen} close={closeModal} />
    </div>
  );
}
