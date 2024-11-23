import React from 'react';
import Modal from 'react-modal';
import './UnverifiedPosts.css';
import axios from 'axios';

const UnverifiedPostsModal = ({ isOpen, closeModal, unverifiedPosts,setunverifiedPosts }) => {

  const approvePost = async (postId) => {
    try {
      console.log(postId);
      const response = await axios.post(`${process.env.SERVER_URL}api/posts/verify/${postId}`, { status: 'approve' });
      console.log(response.data);
      // Update UI or take further actions based on the response
      setunverifiedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };
  
  const disapprovePost = async (postId) => {
    try {
      const response = await axios.post(`${process.env.SERVER_URL}/api/posts/verify/${postId}`, { status: 'disapprove' });
      console.log(response.data);
      // Update UI or take further actions based on the response
      setunverifiedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error disapproving post:', error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel='Unverified Posts Modal'
      overlayClassName={isOpen ? 'Overlay Overlay--open' : 'Overlay'}
      className={isOpen ? 'Modal Modal--open' : 'Modal'}
     
      shouldCloseOnEsc={false}  // Disable close on pressing Esc key
    >
      <div className='UnverifiedPostsModal'>
        <h2 className='center'>Unverified Posts</h2>
        <div>
  {unverifiedPosts.length > 0 ? (
    unverifiedPosts.map((unverifiedPost) => (
      <div key={unverifiedPost._id} className='Post'>
        <img src={unverifiedPost.imageUrl} alt="Post" />
        <span><b>{unverifiedPost.username}</b></span>
        <span style={{ display: "block", fontSize: "12px" }}> {unverifiedPost.userRole.charAt(0).toUpperCase() + unverifiedPost.userRole.slice(1)}</span>
        <p>{unverifiedPost.description}</p>
        <div className='ButtonContainer'>
          <button className='Button Button--approve' onClick={() => approvePost(unverifiedPost._id)}>Approve</button>
          <button className='Button Button--disapprove' onClick={() => disapprovePost(unverifiedPost._id)}>Disapprove</button>
        </div>
      </div>
    ))
  ) : (
    <p className='center'>No posts waiting for approval</p>
  )}
</div>

       
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default UnverifiedPostsModal;
