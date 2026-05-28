import "../styling/Forum.css";
import { useState, useEffect } from 'react';
import ForumPost from "../components/ForumPost";
import CreatePost from "@/components/CreatePost";
import DiscussionBoard from "@/components/DiscussionBoard";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const ForumPage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [allDiscussions, setAllDiscussions] = useState([]);
  const [currentDiscussion, setCurrentDiscussion] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const discussions = allDiscussions.filter((discussion) => `${discussion.title}`.toLowerCase().includes(searchText.toLowerCase()))

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

  // fetch user data from the database
  useEffect(() => {
    const fetchCurrentUser = async() => {
      try {
        const { data } = await axios.get(`http://localhost:3000/users/${user.id}`);
        setUserData(data);
      } catch (error) {
        console.error(error.response?.data);
      }
    }
    fetchCurrentUser();
  }, [user])

  // fetch all discussions from database
  useEffect(() => {
    const fetchDiscussions = async () => {
      const { data } = await axios.get('http://localhost:3000/forum');
      const userData = await axios.get("http://localhost:3000/users");
      const allUsers = userData.data;

      // convert users into a dictionary for lookup via id
      const userMap = allUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      // add in user profile photo to posts
      const postData = data.map(post => ({
        ...post,
        imageUrl: userMap[post.user_id].images?.[0]?.url || null // Fallback if no user is found
      }));


      postData.sort((a, b) => b.created_at.seconds - a.created_at.seconds);
      setAllDiscussions(postData);
    }
    
    fetchDiscussions();
  }, [refresh, currentDiscussion]);

  return (
    <>
      <section className="page-content">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none">Forum</h1>

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
            imageUrl={item.imageUrl}
            date={new Date(item.created_at.seconds * 1000).toLocaleDateString('en-US')}
            postTitle={item.title} 
            message={item.message} 
            username={item.user_display}/>))}
        </section> : null }

        {/* open specific post */}
        {currentDiscussion ?  <DiscussionBoard userData={userData} handleDelete={handleDelete} discussionData={currentDiscussion} updateDiscussion={setCurrentDiscussion}/> : null}

        {/* view create post form */}
        {openForm ? <CreatePost closeForm={setOpenForm} setRefresh={setRefresh}/> : null}
      </section>
    </>
  );
}
export default ForumPage;

