import React,{useContext} from 'react';
import { AppContext } from '../context/App_context'
import { useState } from 'react';
import { ToastContainer, toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login=()=> {
const navigate = useNavigate()
    const data = useContext(AppContext);

    const[email, setEmail]= useState("")
    const[password, setPassword]= useState("")

    const handleSubmit = async (e)=>{
      console.log("handle click in working")
        e.preventDefault()
        const returndata = await data.login(email,password);

        console.log("data volcanus =",returndata)

        toast.success(returndata.message, {
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
          if(
            returndata.message !=="USer not exist"&&
            returndata.message !=="Invalid Credential.."
            ){
          setTimeout(()=>{
        navigate('/');
      },2000);
    }
    };
  return (
    <>
<ToastContainer/>

    <div className='container my-5'>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
         
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      </div>
    </>
  );
}

export default Login;
