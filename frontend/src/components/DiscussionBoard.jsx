import { useState, useEffect } from 'react';
import { User } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {ArrowLeft, Heart, Ban, Trash, SendHorizontal, MessageSquareQuote} from 'lucide-react';
import axios from 'axios';
import ForumReply from './ForumReply';


const DiscussionBoard = ( {userData, handleDelete, discussionData, updateDiscussion} ) => {
  const { user } = useAuth();
  const [reply, setReply] = useState(null);
  const [allReplies, setAllReplies] = useState(null);
  const [edit, setEdit] = useState(false);
  const [numReplies, setNumReplies] = useState(0);

  const handleLike = async () => {
    // unlike the post
    let updatedLikes;
    if (discussionData.likes.includes(user.id)) {
      updatedLikes = discussionData.likes.filter(id => id !== user.id);
      // like the post
    } else {
      updatedLikes = [...discussionData.likes, user.id];
    }
    updateDiscussion({...discussionData, likes: updatedLikes})
    try {
      await axios.put("http://localhost:3000/forum/likes", {...discussionData, likes: updatedLikes});
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  const handleReply = async (discussion_id, newReply) => {
    try {
      // edit an old reply
      if (edit) {
        newReply.created_at = new Date(newReply.created_at.seconds * 1000);
        await axios.put("http://localhost:3000/forum/reply", newReply);

        setAllReplies(allReplies => allReplies.map(reply => reply.id === newReply.id ? {...reply, ...newReply, created_at: reply.created_at} : reply))
      // create a new reply
      } else {
        newReply.discussion_id = discussion_id;

        // temp fields for rendering 
        newReply.id = numReplies;
        const date = new Date();
        const seconds = Math.floor(date.getTime() / 1000);

        newReply.created_at = {
          type: 'firestore/timestamp/1.0',
          seconds: seconds,
          nanoseconds: 0,
        };
        newReply.likes = [];
        newReply.imageUrl = userData.images?.[0]?.url || null;
        
        await axios.post("http://localhost:3000/forum/reply", newReply);
        setAllReplies([newReply, ...allReplies]);
        setNumReplies(numReplies+1);
      }
      
      setReply(null); // clear it out
      setEdit(null);
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  const deleteReply = async (reply_id) => {
    try {
      // delete in database
      await axios.delete("http://localhost:3000/forum/reply", {params: {reply_id: reply_id}})
      // update on webpage
      setAllReplies(allReplies.filter(reply => reply.id != reply_id))
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    const fetchReplies = async () => {
      setAllReplies(null);
      try {
        const { data } = await axios.get('http://localhost:3000/forum/reply', 
          {params: 
            {discussion_id: discussionData.id}
          }
        );
        const userData = await axios.get("http://localhost:3000/users");
        const allUsers = userData.data;

        // convert users into a dictionary for lookup via id
        const userMap = allUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // add in user profile photo to posts
        const replyData = data.map(reply => ({
          ...reply,
          imageUrl: userMap[reply.user_id].images?.[0]?.url || null // Fallback if no user is found
        }));
        replyData.sort((a, b) => b.created_at.seconds - a.created_at.seconds); // sort in reverse order
        setAllReplies(replyData);

      } catch (error) {
        console.error(error.response?.data);
      }
    }
    fetchReplies();
  }, []) 


  return (
    <>
      {/* open specific post */}
      <section className="post-container"> 
        <header className="flex-col border-b relative border-gray-400 pb-[1rem] w-[100%] h-[fit-content]">
          {user.id === discussionData.user_id ? <Trash onClick={() => handleDelete(discussionData.id)} className="exit-icon"/> : null}
          <div className="flex items-center gap-[1rem]">
            <ArrowLeft 
            className="exit-arrow"
            onClick={() => updateDiscussion(null)}
            />
            <div className="flex h-[3rem] w-[3rem] items-center justify-center overflow-hidden rounded-full border border-black bg-[#E5E5E5]">
                {/* Avatar centered */}
              <Avatar className="size-20">
                <AvatarImage src={discussionData.imageUrl} alt="profile photo" />
                <AvatarFallback className="bg-muted">
                  <User className="size-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-col">
              <p>{discussionData.user_display}</p>
              <p>{discussionData.created_at_str}</p>
            </div>
          </div>
          
          <h1 className="post-title">{discussionData.title}</h1>
          <p>{discussionData.message}</p>
          <div className="flex gap-[1rem] items-center">
            <p className="pt-[0.5rem] text-gray-500">{allReplies? allReplies.length : "0"}</p>
            <MessageSquareQuote 
            onClick={() => setReply({message: "", user_id: user.id, user_display: user.displayName})}
            className="w-[2rem] h-[2rem] pt-[0.5rem] text-gray-500 cursor-pointer hover:text-black" />
            <p className="pt-[0.5rem] text-gray-500">
            {discussionData?.likes?.length || 0}
          </p>
          <Heart 
            fill={discussionData?.likes?.includes(user?.id) ? "#4682A9" : "none"} 
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

              <button onClick={() => handleReply(discussionData.id, reply ? reply : edit)} className="create-button"> <SendHorizontal /> {edit ? "Update" : "Submit"}</button>
            </div>
          </> 
        : null}

        {allReplies ? 
          <section className="flex flex-col max-h-[40vh] overflow-auto p-[1rem]">
            {allReplies.map((reply) => (<ForumReply handleDelete={deleteReply} user_id={user.id} isEditing={setEdit} key={reply.id} canEdit={reply.user_id === user.id} reply={reply}/>
            ))}
          </section> : null}
      
      </section>
    </>
  );
}
export default DiscussionBoard;