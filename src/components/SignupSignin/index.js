import React, { useState } from 'react';
import './styles.css';
import Input from '../Input';
import Button from '../button';
import { toast } from 'react-toastify';
import {auth ,db,} from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSigininComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading,setLoading]=useState(false);
    const [loginForm,setLoginForm]=useState(false);
    const navigate=useNavigate();


    function signupWithEmail(){
      setLoading(true);
      console.log("Name",name);
      console.log("Email",email);
      console.log("Password",password);
      console.log("confom password",confirmPassword);
      if(name!="" && email!="" && password!="" && confirmPassword!=""){
        if(password==confirmPassword){
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User>>>",user);
            toast.success("user created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
        
            // create A doc with user id as the following id
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage =(error.message) ;
            console.error("Firebase Error:", errorCode, errorMessage);
            toast.error(`Error: ${errorMessage}`);
            setLoading(false);
            // ..
          });
        }
        else{
          toast.error("password and confirm password do not match");
          setLoading(false);
        }
      }
      else{
        toast.error("all filed are mendatory");
        setLoading(false);
      } 
    }
    function loginUsingEmail(){
      console.log("Email",email);
      console.log("password",password);
      setLoading(true);
      if( email!="" && password!="" ){
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            toast.success("user Logged In!");
            console.log("user loged in",user);
            navigate("/dashboard");
            setLoading(false);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("All fild are mendatory! ");
      }
    }
//! create the doc , contain user given data
    async function createDoc(user){
      //make sure that the doc with the uid doesnot exist
      //create the doc.
      setLoading(true)
      if(!user) return;

      const userRef=doc(db,"user",user.uid);
      const userData=await getDoc(userRef);

      if(!userData.exists()){
        try{
          await setDoc(doc(db, "user", user.uid), {
            name:user.displayName? user.displayName:name,
            email:user.email,
            photoURL:user.photoURL?user.photoURL:"",
            createdAt:new Date(),
          });
          toast.success("Doc created");
          setLoading(false);
        }
        catch(e){
          toast.error(e.message );
          setLoading(false);
        }
      } else{
        //toast.error("Doc already exists");
        setLoading(false);
      }
  
    }

    //! crreating function for sigining throug the google
    function googleAuth(){
      
      setLoading(true);
      const provider = new GoogleAuthProvider();
      try{
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("user>>>",user);
            createDoc(user);
            setLoading(false);
            navigate("/dashboard"); // ✅ CORRECT
            toast.success("User authenticated!");
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          }).catch((error) => {
            setLoading(false);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
          });
      }catch(e){
        setLoading(false);
        toast.error(e.message);
      }
  }
  return (
    <>
    {loginForm?(
        <div className="signup-wrapper">
          <h2 className='title'>
            Login on<span style={{color:"var(--blue)"}}>Financely.</span>
          </h2>
        <form>
          <Input 
          type="email"
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder ={"Example@gmail.com"}
          />
       
          <Input 
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder ={"password1234"}
          />

          <Button
            disabled={loading}
            text={loading ? "loading.." :"Login using email and password"} 
            onClick={loginUsingEmail}
          />
          <p className='p-login' style={{textAlign:"center", margin:0}}>or</p>
          <Button 
            onClick={googleAuth}
            text={loading ? "loading.." :"Login using Google"} 
            blue={true} 
          />
          <p className='p-login' style={{cursor:"pointer"}}
            onClick={()=>setLoginForm(!loginForm)} >
            or Don't have an Account ? click Here</p>
        </form>
      </div>
     ):(
      <div className="signup-wrapper">
        <h2 className='title'>
          Login on<span style={{color:"var(--blue)"}}>Financely.</span>
        </h2>
        <form>
          <Input 
          type="Name"
          label={"Name"}
          state={name}
          setState={setName}
          placeholder ={"EXAMPLE-NAME"}
          />

          <Input 
          type="email"
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder ={"Example@gmail.com"}
          />
       
          <Input 
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder ={"password1234"}
          />

          <Input 
          type="password"
          label={"confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder ={"password1234"}
          />

          <Button
            disabled={loading}
            text={loading ? "loading.." :"Signup using email and password"} 
            onClick={signupWithEmail}
          />
          <p className='p-login' style={{textAlign:"center", margin:0}}>or</p>
          <Button 
            onClick={googleAuth}
            text={loading ? "loading.." :"Signup using Google"} 
            blue={true} 
          />
          <p className='p-login' 
            style={{cursor:"pointer"}}
            onClick={()=>setLoginForm(!loginForm)}
          >or have an Account Already ? click Here</p>
        </form>
      </div>
     )
  }
     
    </>
  );
}

export default SignupSigininComponent;