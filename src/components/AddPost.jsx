import React, { useContext, useState } from 'react';
import { AppContext } from '../context/App_context';
import { ToastContainer, toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
 

const AddPost = () => {
  const data = useContext(AppContext)
  const navigate=useNavigate();
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [imgUrl,setImgUrl]=useState('')

  const submitHandler= async(e)=>{
    
    e.preventDefault();
    console.log('getting from data =',title,description,imgUrl)
  const res= await data.addPost(title,description,imgUrl);
   toast.success(res.message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
    });
    data.setReload(!data.reload)
    setTimeout(() => {
      navigate('/')
    },1000);
  }
  return (
    <>
    <ToastContainer/>
    <div className='container my-5' style={{ width:'700px'}}>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
        <label htmlFor="exampleInputName" className="form-label">Title</label>
          <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control" id="exampleInputName" aria-describedby="emailHelp" required/>
          
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
          <input type="text"value={description} onChange={(e)=>setDescription(e.target.value)} className="form-control" id="exampleInputPassword1"required />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">ImgUrl</label>
          <input type="text"value={imgUrl} onChange={(e)=>setImgUrl(e.target.value)} className="form-control" id="exampleInputPassword1" required />
        </div>
        <button type="submit" className="btn btn-primary">Add Post</button>
      </form>
    </div>
    </>
    );
}

export default AddPost;
