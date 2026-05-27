import "../styling/Forum.css";
import { User, SquarePen, Trash } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const ForumReply = ({reply, isEditing, refresh, canEdit}) => {
  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3000/forum/reply", {params: {reply_id: reply.id}})
      refresh(prevState => !prevState);
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  return (
    <>
      <div className="flex m-[0.5rem] gap-[1rem] items-center">
        <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center overflow-hidden rounded-full border border-black bg-[#E5E5E5]">
          <User className="h-6 w-6 text-[#222222]" strokeWidth={2}/>
        </div>
        <p className="font-bold">{reply.user_display}</p>
        <p className="text-[0.875rem] italic">
          {reply.created_at && formatDistanceToNow(reply.created_at.seconds * 1000, { addSuffix: true })}
        </p>
        { canEdit ? <SquarePen onClick={() => {
          isEditing({...reply})}} className="icon-button-small"/> : null }
        { canEdit ? <Trash onClick={() => handleDelete()} className="icon-button-small" /> : null }
      </div>
      <p className="pl-[3.5rem]"> {reply.message} </p>
    </>
  );
}
export default ForumReply;