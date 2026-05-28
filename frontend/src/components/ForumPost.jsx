import "../styling/Forum.css";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/context/useTheme";

const ForumPost = ( {postTitle, message, date, imageUrl, username, onPress } ) => {
  const context = useTheme();
  return (
    <>
      <div onClick={onPress} className="post">
        <section className="post-header">
          <Avatar className="size-10">
            <AvatarImage src={imageUrl} alt="profile photo" />
            <AvatarFallback className="bg-muted">
              <User className="size-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <p>{username}</p>
          <p className={`${context.isDark ? "text-gray-200" : "text-gray-600"} italic text-[0.875rem]`}>{date}</p>
        </section>
        <h1 className="pl-[1rem] pt-[0.5rem] font-bold text-[1.5rem]">{postTitle}</h1>
        <p className="post-text">{message}</p>
      </div>
    </>
  );
}
export default ForumPost;