import { useEffect, useState, type FC } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { firestoreService, type FirestoreResponse } from '../../services/FireStoreService';
import { showToast } from '../../services/Helper';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import type { LikedType, PostType } from '../../types/postType';
import { setLikedArr } from '../../store/slices/postSlice';

interface LikeButtonProps {
  postDetail: PostType
}

const LikeButton: FC<LikeButtonProps> = ({ postDetail }) => {
  const { loggedInUser } = useAppSelector(store => store.user);
  const { docId: postId, likes: postLikedArr } = postDetail!;
  const [totalLikes, setTotalLikes] = useState<number>(postLikedArr.length);
  const [isLiked, setIsLiked] = useState(postLikedArr.includes(loggedInUser!.uid));
  const dispatch = useAppDispatch();

  const handleLike = async () => {
    try {

      setIsLiked(true);
      setTotalLikes(totalLikes + 1);
      const likeData: LikedType = {
        avatar: loggedInUser!.avatar,
        name: loggedInUser!.name,
        uid: loggedInUser!.uid,
        postId: postId!,
      }
      await firestoreService.addDocument("likes", likeData);
      await firestoreService.updateArrayField("posts", postId!, "likes", loggedInUser!.uid, "union");
      dispatch(setLikedArr([...postLikedArr, likeData]));
    } catch (error) {
      setIsLiked(false);
      setTotalLikes(totalLikes - 1);
      showToast("Not Liked", "error");
      console.error("NOT LIKED : ", error);
    }
  }


  const handleDisLike = async () => {

    try {
      setIsLiked(false);
      setTotalLikes(totalLikes - 1);
      await firestoreService.deleteByField("likes", "uid", loggedInUser!.uid);
      await firestoreService.updateArrayField("posts", postId!, "likes", loggedInUser!.uid, "remove");
      dispatch(setLikedArr(postLikedArr));
    } catch (err) {
      const error = err as FirestoreResponse;
      setIsLiked(true);
      setTotalLikes(totalLikes + 1);
      showToast("Not Liked", "error");
      console.error("NOT LIKED : ", error.message);
    }

  }

  useEffect(() => {
    dispatch(setLikedArr(postLikedArr));
  }, [])

  return (
    <button
      onClick={isLiked ? handleDisLike : handleLike}
      className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />} <span>{totalLikes}</span>
    </button>
  )
}

export default LikeButton