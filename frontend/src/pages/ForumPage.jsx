import "../styling/Forum.css";
import { useState, useEffect, useContext } from 'react';
import ForumPost from "../components/ForumPost";
import CreatePost from "@/components/CreatePost";
import ForumReply from "@/components/ForumReply";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User } from "lucide-react";
import {ArrowLeft, Heart, Ban, Trash, SendHorizontal, MessageSquareQuote} from 'lucide-react';

const ForumPage = () => {
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [allDiscussions, setAllDiscussions] = useState([]);
  const [currentDiscussion, setCurrentDiscussion] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [refreshReplies, setRefreshReplies] = useState(false);
  const [reply, setReply] = useState(null);
  const [allReplies, setAllReplies] = useState(null);
  const [edit, setEdit] = useState(false);

  const discussions = allDiscussions.filter((discussion) => `${discussion.title}`.toLowerCase().includes(searchText.toLowerCase()))

  const handleReply = async (discussion_id, newReply) => {
    try {
      // edit an old reply
      if (edit) {
        newReply.created_at= new Date(newReply.created_at.seconds * 1000);
        await axios.put("http://localhost:3000/forum/reply", newReply);
      // create a new reply
      } else {
        newReply.discussion_id = discussion_id;
        await axios.post("http://localhost:3000/forum/reply", newReply);
      }
      
      setRefreshReplies(prevState => !prevState);
      setReply(null); // clear it out
      setEdit(null);
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  const handleDelete = async (discussion_id) => {
    try {
      await axios.delete("http://localhost:3000/forum", {
        params: {discussion_id: discussion_id}
      });
      setCurrentDiscussion(null);
      setRefresh(prevState => !prevState);
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  const handleLike = async () => {
    // unlike the post
    let updatedLikes;
    if (currentDiscussion.likes.includes(user.spotifyId)) {
      updatedLikes = currentDiscussion.likes.filter(id => id !== user.spotifyId);
      // like the post
    } else {
      updatedLikes = [...currentDiscussion.likes, user.spotifyId];
    }
    setCurrentDiscussion({...currentDiscussion, likes: updatedLikes})
    try {
      await axios.put("http://localhost:3000/forum/likes", {...currentDiscussion, likes: updatedLikes});
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  useEffect(() => {
    const fetchDiscussions = async () => {
      const { data } = await axios.get('http://localhost:3000/forum');
      data.sort((a, b) => b.created_at.seconds - a.created_at.seconds);
      setAllDiscussions(data);
    }

    fetchDiscussions();
  }, [refresh, currentDiscussion]);

  useEffect(() => {
    const fetchReplies = async () => {
      setAllReplies(null);
      try {
        if (currentDiscussion === null) return; // initial page render
        const { data } = await axios.get('http://localhost:3000/forum/reply', 
          {params: 
            {discussion_id: currentDiscussion.id}
          }
        );
        data.sort((a, b) => b.created_at.seconds - a.created_at.seconds); // sort in reverse order
        setAllReplies(data);

      } catch (error) {
        console.error(error.response?.data);
      }
    }
    fetchReplies();
  }, [currentDiscussion?.id, refreshReplies]) // only changes upon id change, not other fields like likes

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

          <button 
          onClick={() => setOpenForm(prevState => !prevState)}
          className="create-button" 
          aria-label="create post" 
          label="create post">create post</button>
        </section>
        
        {/* view all posts */}
        {!currentDiscussion ? <section className="post-container">
          {discussions.map((item) => (
            <ForumPost 
            onPress={()=>{
              setCurrentDiscussion({...item, created_at: new Date(item.created_at.seconds * 1000), created_at_str: new Date(item.created_at.seconds * 1000).toLocaleDateString('en-US')})
            }}
            key={item.id} 
            canDelete={user.spotifyId===item.user_id}
            date={new Date(item.created_at.seconds * 1000).toLocaleDateString('en-US')}
            postTitle={item.title} 
            message={item.message} 
            username={item.user_display}/>))}
        </section> : null }

        {/* open specific post */}
        {currentDiscussion ? <section className="post-container"> 
          <header className="flex-col border-b relative border-gray-400 pb-[1rem] w-[100%] h-[fit-content]">
            {user.spotifyId === currentDiscussion.user_id ? <Trash onClick={() => handleDelete(currentDiscussion.id)} className="exit-icon"/> : null}
            <div className="flex items-center gap-[1rem]">
              <ArrowLeft 
              className="exit-arrow"
              onClick={() => setCurrentDiscussion(null)}
              />
              <div className="flex h-[3rem] w-[3rem] items-center justify-center overflow-hidden rounded-full border border-black bg-[#E5E5E5]">
                <User
                  className="h-8 w-8 text-[#222222]"
                  strokeWidth={2}/>
              </div>
              <div className="flex-col">
                <p>{currentDiscussion.user_display}</p>
                <p>{currentDiscussion.created_at_str}</p>
              </div>
            </div>
            
            <h1 className="post-title">{currentDiscussion.title}</h1>
            <p>{currentDiscussion.message}</p>
            <div className="flex gap-[1rem] items-center">
              <p className="pt-[0.5rem] text-gray-500">{allReplies? allReplies.length : "0"}</p>
              <MessageSquareQuote 
              onClick={() => setReply({message: "", user_id: user.spotifyId, user_display: user.displayName})}
              className="w-[2rem] h-[2rem] pt-[0.5rem] text-gray-500 cursor-pointer hover:text-black" />
              <p className="pt-[0.5rem] text-gray-500">
              {currentDiscussion?.likes?.length || 0}
            </p>
            <Heart 
              fill={currentDiscussion?.likes?.includes(user?.spotifyId) ? "#4682A9" : "none"} 
              onClick={() => handleLike()} 
              className="icon-button" 
            />
            </div>
            
          </header>

          {reply || edit ?
          <>
          {/* input message reply */}
          {edit ? <h2 className="font-bold">Edit Post Message</h2> : null}
          <textarea 
          value={reply ? reply.message : edit.message}
          onChange={reply ? (e) => setReply({...reply, message: e.target.value}) : (e) => setEdit({...edit, message: e.target.value})}
          className="border rounded-[0.5rem] border-gray-500 p-[0.5rem] min-h-[3rem]" 
          placeholder="reply..."></textarea>

          <div className="flex w-[100%] justify-end">
            <button onClick={() => {setEdit(null); setReply(null)}}
            className="cancel-button"> <Ban /> Cancel</button>

            <button onClick={() => handleReply(currentDiscussion.id, reply ? reply : edit)} className="create-button"> <SendHorizontal /> {edit ? "Update" : "Submit"}</button>
          </div>
          </> : null}
          {allReplies ? 
            <section className="flex flex-col max-h-[40vh] overflow-auto p-[1rem]">
              {allReplies.map((reply) => (<ForumReply isEditing={setEdit} refresh={setRefreshReplies} key={reply.id} canEdit={reply.user_id === user.spotifyId} reply={reply}/>
              ))}
            </section> : null}
        
        </section> : null}

        {/* view create post form */}
        {openForm ? <CreatePost closeForm={setOpenForm} setRefresh={setRefresh}/> : null}
      </section>
    </>
  );
}
export default ForumPage;