import "../styling/Forum.css";
import { User, Heart, SquarePen, Trash } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from 'react';
import axios from 'axios';
import ConfirmDelete from "./ConfirmDelete";

const ForumReply = ({reply, isEditing, handleDelete, canEdit, user_id}) => {
  const [likes, setLikes] = useState(reply.likes);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleLike = async () => {
    let updatedLikes;
    
    // unlike post
    if (likes.includes(user_id)) {
      updatedLikes = likes.filter(id => id !== user_id);
    } else {
      // like post
      updatedLikes = [...likes, user_id];
    }
    
    try {
      await axios.put("http://localhost:3000/forum/reply", {...reply, created_at: new Date(reply.created_at.seconds * 1000), likes: updatedLikes});
      setLikes(updatedLikes);
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  return (
    <>
      <div className="flex m-[0.5rem] gap-[1rem] items-center">
        <Avatar className="size-10">
          <AvatarImage src={reply.imageUrl} alt="profile photo" />
          <AvatarFallback className="bg-muted">
            <User className="size-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <p className="font-bold">{reply.user_display}</p>
        <p className="text-[0.875rem] italic">
          {reply.created_at && formatDistanceToNow(reply.created_at.seconds * 1000, { addSuffix: true })}
        </p>
        <p className="pt-[0.5rem] text-gray-500">
          {likes.length}
        </p>
        <Heart 
          onClick={() => handleLike()}
          fill={likes.includes(user_id) ? "#4682A9" : "none"} 
          className="icon-button-small" 
        />
        { canEdit ? <SquarePen onClick={() => {
          isEditing({...reply})}} className="icon-button-small"/> : null }
        { canEdit ? <Trash onClick={() => setOpenConfirmation(prevState=>!prevState)} className="icon-button-small" /> : null }
      </div>
      <p className="pl-[3.5rem]"> {reply.message} </p>

      {openConfirmation ? <ConfirmDelete closeForm={setOpenConfirmation} confirmDelete={handleDelete} discussion_id={reply.id}/> : null }
    </>
  );
}
export default ForumReply;