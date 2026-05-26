import "../styling/Forum.css";
import { useState } from 'react';
import ForumPost from "../components/ForumPost";
import CreatePost from "@/components/CreatePost";

const ForumPage = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <section className="page-content">
        <h1 className="page-title">Forum Page</h1>

        <section className="search-container">
          <input 
          className="search-bar"
          type="text" 
          placeholder="search by name..."
          aria-label="post search bar"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          >
          </input>

          <button className="create-button" aria-label="create post" label="create post">create post</button>
        </section>
        
        <section className="post-container">
          <ForumPost postTitle={"title"}/>
          <ForumPost postTitle={"title"}/>
          <ForumPost postTitle={"title"}/>
          <ForumPost postTitle={"title"}/>
          <ForumPost postTitle={"title"}/>
        </section>
      </section>
    </>
  );
}
export default ForumPage;