import React from 'react'
import Posts from "../Posts/Posts"
import PostShare from '../PostShare/PostShare'
import './PostSide.css'
import { Routes, Route } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile'

const PostSide = () => {

  return (
    <div className="PostSide">
    <Routes>
      <Route path="/" element={
        <>
          <PostShare />
          <Posts />
        </>
      } />
      <Route path="/profile/:id" element={<UserProfile />} />
    </Routes>
  </div>
  )
}

export default PostSide  