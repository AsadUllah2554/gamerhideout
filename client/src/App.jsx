import React,{useEffect,useState} from "react";
import "./App.css"
import Home from "./pages/home/Home";
import axios from "axios";
import SignInPage from "./pages/SignIn/SignInPage";
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom'
import { useUserContext } from "./hooks/useUserContext";
import Chat from "./pages/Chat/Chat";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./components/UserProfile/UserProfile";
// import SignIn from "./pages/SignIn/SignIn";

function App() {

  const {user, setUser} = useUserContext();
 
console.log("user from home " ,user)

// useEffect(() => {
//   axios.get("http://localhost:5000/auth/login/success", { withCredentials: true })
//       .then((res) => {
//           if (res.status === 200 ) {
//               setUser(res.data.user); 
//  }

//               // Check if promptForRole is true, then you may want to handle the role selection logic
//           else if (res.status === 201) {
//                   // Handle the role selection logic, e.g., show a modal or redirect to a role selection page
//                   setPrompt(res.data.promptForRole);
//                   setNewUser(res.data.user);
                  
//               }
//           else {
//               // Handle other status codes if needed
//               console.log("Unexpected status code:", res.status);
//           }
//       })
//       .catch((error) => {
//           console.error("Axios Request Error:", error);
//       });
// }, []);
  
  // fetch user here of user context 
  return (
    <Router >  
          <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
      <Route path="/" exact element={user ? <Home />: <Navigate to='/signin' />} />
      <Route path="/signin"  element={!user ? <SignInPage  />: <Navigate to='/' />} />
      <Route path="/chat" element={user  && <Chat />  } />
      <Route path="/profile" element={user  && <UserProfile />  } />
     </Routes>
    </Router>
  );
}

export default App;