import "../styling/Forum.css";

const ForumPost = ( {postTitle} ) => {
  return (
    <>
      <div className="post">
        <section className="post-header">{postTitle}</section>
      </div>
    </>
  );
}
export default ForumPost;