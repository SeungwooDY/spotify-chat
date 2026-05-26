import "../styling/Forum.css";
import { Textarea } from "./ui/textarea";
import {X} from "lucide-react"

const CreatePost = ( {closeForm} ) => {
  return (
    <>
      <section className="form-overlay">
        <div className="new-post-form">
          <X className="exit-icon" 
          onClick={()=>closeForm(prevState=>!prevState)}/>
          
          <h1 className="new-post-title">Create Post</h1>

          <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
            <input 
            type="text" 
            className="new-post-textbox"
            placeholder="Post title">
            </input>
            <Textarea style={{border:"1px solid gray"}} placeholder="Message..."/>
            <button 
            className="create-button" 
            aria-label="create post" 
            onClick={() => closeForm(prevState => !prevState)}
            label="create post">create post</button>
          </div>
          
        </div>
        
      </section>
    </>
  );
}
export default CreatePost;