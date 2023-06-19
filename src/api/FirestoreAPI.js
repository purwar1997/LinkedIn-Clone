import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  queryEqual,
} from 'firebase/firestore';

const usersRef = collection(db, 'users');
const postsRef = collection(db, 'posts');
const commentsRef = collection(db, 'comments');

// User collection
export const createUserAPI = async (userId, name, email) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    await setDoc(docRef, { name, email });
  }
};

export const getCurrentUserAPI = async (userId, setCurrentUser) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('User not found');
  }

  onSnapshot(docRef, doc => {
    const user = { id: doc.id, ...doc.data() };
    setCurrentUser(user);
  });
};

export const getProfileAPI = async (profileId, setProfile) => {
  const docRef = doc(db, 'users', profileId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Profile not found');
  }

  onSnapshot(docRef, doc => {
    const profile = { id: doc.id, ...doc.data() };
    setProfile(profile);
  });
};

export const updateProfileAPI = async (userId, updates) => {
  for (const key in updates) {
    updates[key] = updates[key].trim();
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      delete updates[key];
    }
  }

  const { name, headline, education, location, phoneNo } = updates;

  if (!(name && headline && education, location && phoneNo)) {
    throw new Error('Fields marked with * are mandatory.');
  }

  if (updates.skills) {
    updates.skills = updates.skills.split(', ');
  }

  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('User not found');
  }

  await updateDoc(docRef, updates);
};

// Posts collection
export const createPostAPI = async postData => {
  const docRef = await addDoc(postsRef, postData);

  if (!docRef?.id) {
    throw new Error('Failed to create post');
  }
};

export const getPostsAPI = async setPosts => {
  const q = query(postsRef, orderBy('createdAt', 'desc'));

  onSnapshot(q, querySnapshot => {
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(posts);
  });
};

export const managePostLikesAPI = async (postId, userId, action) => {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Post not found');
  }

  const post = { id: docSnap.id, ...docSnap.data() };

  switch (action) {
    case 'like': {
      post.likedBy = post.likedBy ? [...post.likedBy, userId] : [userId];
      break;
    }

    case 'unlike': {
      post.likedBy = post.likedBy.filter(likedUserId => likedUserId !== userId);
      break;
    }
  }

  await updateDoc(docRef, post);
};

// Comments collection
export const getPostCommentsAPI = async (postId, setComments) => {
  // const q = query(commentsRef, orderBy('date', 'desc'));

  // onSnapshot(q, querySnapshot => {
  //   const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //   setComments(comments);
  // });

  // const postComments = commentIds?.map(async commentId => {
  //   const docRef = doc(db, 'comments', commentId);
  //   const docSnap = await getDoc(docRef);

  //   if (!docSnap.exists()) {
  //     throw new Error('Comment not found');
  //   }

  //   return { id: docSnap.id, ...docSnap.data() };
  // });

  // return postComments;

  const q = query(commentsRef, where('postId', '==', postId), orderBy('postId', 'desc'));

  onSnapshot(q, querySnapshot => {
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(comments);
    setComments(comments);
  });
};

export const addPostCommentAPI = async commentInfo => {
  let docRef = await addDoc(commentsRef, commentInfo);

  if (!docRef?.id) {
    throw new Error('Failed to add comment');
  }

  // const postDocRef = doc(db, 'posts', postId);
  // const postDocSnap = await getDoc(postDocRef);

  // if (!postDocSnap.exists()) {
  //   throw new Error('Post not found');
  // }

  // const post = { id: postDocSnap.id, ...postDocSnap.data() };
  // post.commentedBy = post.commentedBy ? post.commentedBy.push(docRef.id) : [docRef.id];
  // await updateDoc(postDocRef, post);

  // const newPostDocSnap = await getDoc(postDocRef);
  // const updatedPost = { id: newPostDocSnap.id, ...newPostDocSnap.data() };
  // return updatedPost.commentedBy;
};
