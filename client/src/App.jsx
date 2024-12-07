import "./App.css";
import SignInPage from "./pages/SignIn/SignInPage";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { useUserContext } from "./hooks/useUserContext";
import Chat from "./pages/Chat/Chat";
import "react-toastify/dist/ReactToastify.css";
import Marketplace from "./pages/MarketPlace/MarketPlace";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import TimelinePage from "./pages/Timeline/Timeline";
import UserProfile from "./pages/UserProfile/UserProfile";

function App() {
  const { user } = useUserContext();

  console.log("user from home ", user);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={user ? <TimelinePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signin"
          element={!user ? <SignInPage /> : <Navigate to="/" />}
        />
        <Route path="/chat" element={user && <Chat />} />
        <Route path="/profile/:id" element={user && <UserProfile />} />
        <Route path="/profile/" element={user && <UserProfile />} />

        <Route path="/market" element={user && <Marketplace />} />
        <Route path="/product/:userId" element={user && <ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
