// src/components/ErrorNotification.js
import React,{useEffect} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ErrorNotification = ({ message }) => {
  useEffect(() => {
    if (message) {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [message]);

  return null;
};

export default ErrorNotification;