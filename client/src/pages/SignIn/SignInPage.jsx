import React, { useState } from "react";
import { Button, Input, Divider } from "antd";
import { useUserContext } from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const GamingSignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const google = () => {
    window.open(`${process.env.SERVER_URL}/auth/google`, "_self");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        toast.error(
          isSignUp
            ? "Signup failed: "
            : "Signin failed: " + response.data.message
        );
      }
    } catch (error) {
      toast.error(
        isSignUp ? "Error in signup: " : "Error in signin: " + error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="text-2xl font-bold">Gamers Peep</div>
        <div className="space-x-4">
          <Button type="link" className="text-white hover:text-blue-400">
            About
          </Button>
          <Button type="link" className="text-white hover:text-blue-400">
            Contact
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 flex min-h-[calc(100vh-80px)]">
        {/* Left side content */}
        <div className="w-1/2 flex flex-col justify-center pr-12">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Level Up Your Gaming Experience
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Join the ultimate gaming community. Trade items, connect with
            players, and dominate the marketplace.
          </p>
          <div className="flex space-x-4">
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 border-0 h-12 px-8 text-lg"
              onClick={() => setIsSignUp(true)}
            >
              Get Started
            </Button>
            <Button
              size="large"
              className="border-2 border-white hover:border-blue-400 hover:text-blue-400 h-12 px-8 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-1/2 flex items-center">
          <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-12 bg-gray-800 border-gray-700 text-white"
                    required
                  />
                  <Input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="h-12 bg-gray-800 border-gray-700 text-white"
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
                className="h-12 bg-gray-800 border-gray-700 text-white"
                required
              />
              <Input.Password
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 bg-gray-800 border-gray-700 text-white"
                required
              />
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-0 text-lg"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <Divider className="border-gray-700">
              <span className="text-gray-500">OR</span>
            </Divider>

            <Button
              onClick={google}
              className="w-full h-12 flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-black"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </Button>

            <p className="text-center mt-6 text-gray-400">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 hover:text-blue-300"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingSignInPage;
