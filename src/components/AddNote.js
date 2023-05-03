import React,{useContext} from 'react';
import notecontext from "../context/notes/NoteContext";
import { useState } from "react";

const AddNote = (props) => {
const context = useContext(notecontext);
const {addNote} = context;
const [note, setnote] = useState({title:"", description:"", tag:""})
const handleclick =(e)=>{
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setnote({title:"", description:"", tag:""});
    props.showAlert("Note Added","success")
}
const onchange =(e)=>{
    setnote({...note,[e.target.name]: e.target.value})
}
  return (
    <div>
        <div className="container my-3">
        <h2>Add a Note</h2>
        <form className='my-3'>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input value={note.title} type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onchange}/>
          
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input value={note.description} type="text" className="form-control" id="description" name='description' onChange={onchange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Tag</label>
          <input value={note.tag} type="text" className="form-control" id="tag" name='tag' onChange={onchange} />
        </div>
        
        <button disabled={note.title.length< 5 || note.description.length< 5} type="submit" className="btn btn-primary" onClick={handleclick}>Add</button>
      </form>
      </div>
    </div>
  )
}

export default AddNote