import React, { useState } from "react";
import { Button, Input, Divider } from "antd";
import { useUserContext } from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../../assets/images/hero.png";
import "./SignInPage.css";
import { FeatureUnderDevelopmentModal } from "../../components/UnderDevelopment/FeatureUnderDevelopment";

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false);
  console.log("isFeatureModalVisible ", isFeatureModalVisible);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const loginAsGuest = async (location) => {

    try {
      const response = await axios.post(
        `${process.env.SERVER_URL}/auth/guest`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setUser({
          ...response.data.user,
          token: response.data.token,
        });
        navigate(location);
      } else {
        message.error(
          "Guest login failed: " + response.data.message
        );
      }
    } catch (error) {
      message.error(
        "Error in guest login: " + error.message
      );
    }
  };
  const google = () => {
    window.open(`${process.env.SERVER_URL}/auth/google`, "_self");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    console.log("isSignUp", isSignUp);
    // Reset form data when toggling
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
      const response = await axios.post(
        `${process.env.SERVER_URL}${endpoint}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setUser({
          ...response.data.user,
          token: response.data.token,
        });
        navigate("/");
      } else {
        message.error(
          isSignUp
            ? "Signup failed: "
            : "Signin failed: " + response.data.message
        );
      }
    } catch (error) {
      message.error(
        isSignUp ? "Error in signup: " : "Error in signin: " + error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-no-repeat bg-cover md:bg-contain"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: "right center",
          }}
        />
      </div>

      <nav className="relative z-10 flex justify-center items-center p-4 md:p-6">
        <div className="text-xl md:text-2xl font-bold text-black hover:text-blue-600 transition-colors cursor-pointer">
          Gamers Hideout
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] gap-8">
          {/* Left side content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-black text-center lg:text-left">
              Connect, Share, and Trade with Fellow Gamers
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 text-center lg:text-left">
              Join the ultimate gaming community where you can share your gaming
              moments, chat with other players, and trade gaming items all in
              one place.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Button
                type="primary"
                size="large"
                className="bg-blue-600 hover:bg-blue-700 border-0 h-12 px-8 text-lg"
              >
                Join Community
              </Button>
              <Button
                size="large"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-12 px-8 text-lg"
                onClick={()=>loginAsGuest('/market')}
              >
                Explore Marketplace
              </Button>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
              <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-lg md:text-xl font-semibold mb-2">
                  Social Timeline
                </div>
                <div className="text-gray-600">→</div>
              </div>
              <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-lg md:text-xl font-semibold mb-2">
                  Live Chat
                </div>
                <div className="text-gray-600">→</div>
              </div>
              <div className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="text-lg md:text-xl font-semibold mb-2">
                  Gaming Marketplace
                </div>
                <div className="text-gray-600">→</div>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
            <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-black text-center">
                {isSignUp ? "Join Gamers Hideout" : "Welcome Back Gamer"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <Input
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                    <Input
                      name="username"
                      placeholder="Gamer Tag"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                  </>
                )}
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12"
                  required
                />
                <Input.Password
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12"
                  required
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-0 text-lg"
                >
                  {isSignUp ? "Start Gaming Journey" : "Sign In"}
                </Button>
               
              </form>
              <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 border-0 text-lg"
                  onClick={()=>loginAsGuest('/')}
               >
                  Roam as Guest User
                </Button>
              <Divider>
                <span className="text-gray-500">OR</span>
              </Divider>

              <Button
                onClick={() => setIsFeatureModalVisible(true)}
                className="w-full h-12 flex items-center justify-center space-x-2 border border-gray-200 hover:bg-gray-50"
              >
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </Button>
              <p className="text-center mt-6 text-gray-600">
                {isSignUp ? "Already a member? " : "New to Gamers Hideout? "}
                <Button
                  type="link"
                  onClick={toggleSignUp}
                  className="text-blue-600 span-btn hover:text-blue-700 hover:underline cursor-pointer font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Button>
              </p>
              <FeatureUnderDevelopmentModal
                visible={isFeatureModalVisible}
                onClose={() => setIsFeatureModalVisible(false)}
                featureName="Google Signin"
                additionalDetails="Google Signin feature is under development. Please use the email and password to signin."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
