import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUsersAPI, getPostsAPI } from '../../api/FirestoreApi';
import Modal from '../Modal/index';
import PostCard from '../PostCard/index';
import topbarLogo from '../../assets/topbarLogo.png';
import './index.css';

export default function UserFeed({ currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        await getPostsAPI(setPosts);
      } catch (err) {
        toast.error(err.message);
      }
    };

    getPosts();

    const getUsers = async () => {
      try {
        await getUsersAPI(setUsers);
      } catch (err) {
        toast.error(err.message);
      }
    };

    getUsers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='userfeed'>
      <div className='create-post-card'>
        <img src={currentUser.imageUrl} alt={currentUser.name} />

        <button className='open-modal-btn' onClick={openModal}>
          Start a post
        </button>
      </div>

      {isModalOpen && <Modal closeModal={closeModal} currentUser={currentUser} />}

      {posts.length > 0 && (
        <div className='posts'>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              postedBy={users.find(user => user.id === post.userId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
