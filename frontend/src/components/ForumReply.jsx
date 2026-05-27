import "../styling/Forum.css";
import { User } from "lucide-react";

const ForumReply = ({userDisplay, message}) => {
  return (
    <>
      <div className="flex gap-[1rem] items-center">
        <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center overflow-hidden rounded-full border border-black bg-[#E5E5E5]">
          <User className="h-6 w-6 text-[#222222]" strokeWidth={2}/>
        </div>
        <p className="font-bold">{userDisplay}</p>
      </div>
      <p className="pl-[3.5rem]"> {message} </p>
    </>
  );
}
export default ForumReply;