import "../styling/Forum.css";
import {X, CircleAlert } from "lucide-react"
import { Button } from "./ui/button.jsx";

const ConfirmDelete = ( {closeForm, confirmDelete, discussion_id} ) => {

  return (
    <>
      {/* blurred background */}
      <section className="form-overlay">
        {/* create post form */}
        <div className="confirm-delete-form">
          <X className="exit-icon" 
          onClick={()=>closeForm(prevState=>!prevState)}/>
          <p></p>
          {/* inputs section */}
          <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
            <CircleAlert className="text-yellow-500 w-[4rem] h-[4rem]" />
            <p className="text-[2rem] font-bold">Confirm Delete</p>
            <p>This action cannot be undone</p>

            <div className="flex gap-[1rem] mt-[1rem]">
              <Button
              variant="outline"
              size="sm"
              onClick={() => confirmDelete(discussion_id)}
              className="mt-3 cursor-pointer border-[#6EA3D5] text-xs text-[#6EA3D5] hover:bg-[#6EA3D5]/10"
              >
                Confirm
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => closeForm(prevState=>!prevState)}
              className="mt-3 cursor-pointer border-[red] text-xs text-[red] hover:bg-[#6EA3D5]/10"
              >
                Cancel
              </Button>
            </div>
            
          </div>
          
        </div>
        
      </section>
    </>
  );
}
export default ConfirmDelete;