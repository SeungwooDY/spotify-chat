import "../styling/Forum.css";
import { User } from "lucide-react";

const ForumPost = ( {postTitle, message, date, username, onPress } ) => {
  
  return (
    <>
      <div onClick={onPress} className="post">
        <section className="post-header">
          <div className="flex h-[2rem] w-[2rem] m-[0.5rem] items-center justify-center overflow-hidden rounded-full border border-black bg-[#E5E5E5]">
            <User
              className="h-8 w-8 text-[#222222]"
              strokeWidth={2}/>
          </div>
          <p>{username}</p>
          <p className="text-gray-600 text-[0.875rem]">{date}</p>
        </section>
        <h1 className="pl-[1rem] pt-[0.5rem] font-bold text-[1.5rem]">{postTitle}</h1>
        <p className="post-text">{message}</p>
      </div>
    </>
  );
}
export default ForumPost;