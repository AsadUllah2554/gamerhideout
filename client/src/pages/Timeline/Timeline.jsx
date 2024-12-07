import React, { useContext, useEffect, useState } from "react";
import { Input, Button, Card, Modal } from "antd";
import backgroundImage from "../../assets/images/hero.png";
import ProfileCard from "../../components/ProfileCard.jsx/ProfileCard";
import { useUserContext } from "../../hooks/useUserContext";
import PostShare from "../../components/PostShare/PostShare";
import axios from "axios";
import Post from "../../components/Post/Post";
import { PostContext } from "../../context/postContext";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import Navbar from "../../components/Navbar/Navbar";
import { PostSkeletonList } from "../../components/Skeleton/Skeleton";

const TimelinePage = () => {
  const { user } = useUserContext();
  const { posts, setPosts } = useContext(PostContext);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.SERVER_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setPosts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Error fetching posts:", error);
    }
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      fetchPosts();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 opacity-5 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: "right center",
        }}
      />

      {/* Top Navbar */}
      <Navbar title={"Gamers Hideout"} />

      <div className=" mx-auto pt-24 px-4 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard />
          {/* Center: Timeline */}
          <div>
            {/* Create Post Section */}
            <PostShare />

            {/* Posts */}
            {loading ? (
              <PostSkeletonList count={4} />
            ) : (
              posts.map((post) => (
                <Post post={post} id={post._id} key={post._id} />
              ))
            )}
          </div>

          {/* Right Side: Notifications & Trending */}
          <div className="hidden md:block">
            <NotificationCard />
            <Card title="Trending Games">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Dota 2</span>
                  <span className="text-green-600">🔥 Hot</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Valorant</span>
                  <span className="text-green-600">🔥 Hot</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cyberpunk 2077</span>
                  <span className="text-green-600">🔥 Hot</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <Modal
        title="Comments"
        open={!!selectedPost}
        onCancel={() => setSelectedPost(null)}
        footer={null}
      >
        {selectedPost && (
          <div>
            <div className="mb-4">
              <Input.TextArea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
            <Button type="primary" onClick={handleAddComment} className="mt-2">
              Add Comment
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TimelinePage;
