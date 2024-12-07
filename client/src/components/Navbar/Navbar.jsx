import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  MessageOutlined,
  ShoppingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FeatureUnderDevelopmentModal } from "../UnderDevelopment/FeatureUnderDevelopment";

const Navbar = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 flex justify-between items-center p-2 px-4 md:p-6 md:px-20">
      <div className="text-lg md:text-xl font-bold text-black hover:text-blue-600 transition-colors">
        {title}
      </div>
      <div className="flex space-x-8">
        <Link to="/">
          {" "}
          <HomeOutlined className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />{" "}
        </Link>
        <MessageOutlined
          className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <Link to="/market">
          {" "}
          <ShoppingOutlined className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />{" "}
        </Link>
        <Link to="/profile/">
          <SettingOutlined className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
        </Link>
      </div>
      <FeatureUnderDevelopmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featureName="Messaging"
        additionalDetails="Real-time messaging is coming soon! We're working on providing a seamless communication experience."
      />
    </nav>
  );
};

export default Navbar;
