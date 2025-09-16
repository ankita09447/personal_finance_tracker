import React, { useEffect } from 'react'
import './styles.css'
import {auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import  userImg from "../../assests/user.svg"
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user){
      navigate("/dashboard");
    }
  },[user,loading])
  
 function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged out successfully");
          navigate("/");
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    
    <div className='navbar'>
      <p className='logo'>Financely.</p>
      {user &&(
        <div style={{display:"flex",alignItems:"center",gap:"0.7rem"}}>
          <img 
          src={user.photoURL?user.photoURL:userImg}
           style={{borderRadius:"50%",height:"1.7rem" ,width:"1.7rem"}}
          />
         <p className='logo link' onClick={logoutFnc}>Logout</p>
        </div>
      )}
    </div>
  ) ;
}

export default Header