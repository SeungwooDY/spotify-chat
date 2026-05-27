import "../styling/Forum.css";
import { useState, useEffect, useContext } from 'react';
import ForumPost from "../components/ForumPost";
import CreatePost from "@/components/CreatePost";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User } from "lucide-react";
import {ArrowLeft, Ban, Trash, SendHorizontal, MessageSquareQuote} from 'lucide-react';

const ForumPage = () => {
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [allDiscussions, setAllDiscussions] = useState([]);
  const [currentDiscussion, setCurrentDiscussion] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [reply, setReply] = useState(false);

  const discussions = allDiscussions.filter((discussion) => `${discussion.title}`.toLowerCase().includes(searchText.toLowerCase()))

  useEffect(() => {
    const fetchDiscussions = async () => {
      // console.log(user);
      const { data } = await axios.get('http://localhost:3000/forum');
      setAllDiscussions(data);
    }

    fetchDiscussions();
  }, [refresh]);

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
              setCurrentDiscussion({created_at: new Date(item.created_at.seconds * 1000).toLocaleDateString('en-US'), user_id: item.user_id, user_display: item.user_display, message: item.message, title: item.title})
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
            {user.spotifyId === currentDiscussion.user_id ? <Trash className="exit-icon"/> : null}
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
                <p>{currentDiscussion.created_at}</p>
              </div>
            </div>
            
            <h1 className="post-title">{currentDiscussion.title}</h1>
            <p>{currentDiscussion.message}</p>
            <MessageSquareQuote 
            onClick={() => setReply(prevState => !prevState)}
            className="w-[2rem] h-[2rem] pt-[0.5rem] text-gray-500 cursor-pointer hover:text-black" />
          </header>
          {reply ? 
          <>
          <textarea 
          className="border rounded-[0.5rem] border-gray-500 p-[0.5rem]" 
          placeholder="reply..."></textarea>
          <div className="flex w-[100%] justify-end">
            <button onClick={() => setReply(prevState=>!prevState)}
            className="cancel-button"> <Ban /> Cancel</button>

            <button className="create-button"> <SendHorizontal /> Submit</button>
          </div>
          </> : null}
          
          
          

        </section> : null}

        {/* view create post form */}
        {openForm ? <CreatePost closeForm={setOpenForm} setRefresh={setRefresh}/> : null}
      </section>
    </>
  );
}
export default ForumPage;