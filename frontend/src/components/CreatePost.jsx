import "../styling/Forum.css";
import {X} from "lucide-react"
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CreatePost = ( {closeForm, setRefresh} ) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [titleErr, setTitleErr] = useState(false);
  const [messageErr, setMessageErr] = useState(false);

  const handleCreatePost = async () => {
    if (message === "") {
      setMessageErr(true);
    } else {
      setMessageErr(false);
    }
    if (title === "") {
      setTitleErr(true);
    } else {
      setTitleErr(false);
    }
    if (message === "" || title === "") return;

    const discussionObject = {user_id: user.spotifyId, user_display: user.displayName, message: message, title: title};

    try {
      await axios.post('http://localhost:3000/forum', discussionObject);
      setRefresh(prevState => !prevState);
      closeForm(prevState => !prevState);

    } catch (err) {
      console.error(err.response?.data);
    }
  }

  return (
    <>
      {/* blurred background */}
      <section className="form-overlay">
        {/* create post form */}
        <div className="new-post-form">
          <X className="exit-icon" 
          onClick={()=>closeForm(prevState=>!prevState)}/>

          <h1 className="new-post-title">Create Post</h1>

          {/* inputs section */}
          <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
            <input 
            type="text" 
            required
            className={`${titleErr ? "error" : ""} new-post-textbox`}
            placeholder="Post title"
            onChange={(e) => setTitle(e.target.value)}
            ></input>
            {titleErr ? <span className="helper-text" aria-label="helper-text-title">Post titles are required</span> : null}

            <textarea 
            required
            className={`${messageErr ? "error" : ""} new-post-textbox pt-3`}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."/>
            {messageErr ? <span className="helper-text" aria-label="helper-text-message">Post messages are required</span> : null}

            <button 
            className="create-button" 
            aria-label="create post" 
            onClick={() => handleCreatePost()}
            label="create post">create post</button>
            
          </div>
          
        </div>
        
      </section>
    </>
  );
}
export default CreatePost;