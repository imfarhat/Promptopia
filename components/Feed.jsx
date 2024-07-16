"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = async (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    if (searchText === "") {
      setFilteredPosts(posts); // Display all posts when search text is empty
    } else {
      const filtered = await filterPosts(searchText);
      setFilteredPosts(filtered);
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    };
    fetchPost();
  }, []);

  const filterPosts = async (searchText) => {
    const regex = new RegExp(searchText, "i"); // "i" flag for case-sensetive search

    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleTagClick = async (tag) => {
    setSearchText(tag);
    const filtered = await filterPosts(tag);
    setFilteredPosts(filtered);
  };

  return (
    <section className="feed">
      <form action="#" className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          name="search-text"
          id="search-text"
          required
          className="search_input peerr"
        />

        {searchText && (
          <label
            htmlFor="search-text"
            className="absolute right-3 text-xs sm:text-sm font-inter text-gray-500 cursor-pointer select-none"
            onClick={() => {
              if (!searchText) return;
              setSearchText("");
              setFilteredPosts(posts);
            }}
          >
            Reset
          </label>
        )}
      </form>
      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};
export default Feed;
