import { useState, type FC } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { firestoreService } from '../../services/FireStoreService';
import { showToast } from '../../services/Helper';
import { useAppSelector } from '../../store/storeHooks';
import type { LikedType, PostType } from '../../types/postType';

interface LikeButtonProps {
  postDetail: PostType
}

const LikeButton: FC<LikeButtonProps> = ({ postDetail }) => {
  const { loggedInUser } = useAppSelector(store => store.user);
  const { docId: postId, likes: postLikedArr } = postDetail!;
  const [totalLikes, setTotalLikes] = useState(postLikedArr);
  const [isLiked, setIsLiked] = useState(postLikedArr.includes(loggedInUser!.uid));

  console.log("sdsdf", new Set([...postLikedArr, loggedInUser!.uid]))

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
      const updateUserLikes = await firestoreService.updateDocument("posts", postId!, { likes: [...postLikedArr, loggedInUser!.uid] });
      if (!updateUserLikes) {
        setIsLiked(false);
        setTotalLikes(totalLikes - 1);
      }

    } catch (error) {
      setIsLiked(false);
      setTotalLikes(totalLikes - 1);
      showToast("Not Liked", "error");
      console.error("NOT LIKED : ", error);
    }
  }


  const handleDisLike = async () => {

    setIsLiked(false);
    setTotalLikes(totalLikes - 1);
    await firestoreService.deleteByField("likes", "uid", loggedInUser!.uid);
    const { success, message } = await firestoreService.updateArrayField("posts", postId!, "likes", loggedInUser!.uid, "remove");
    if (!success) {
      setIsLiked(true);
      setTotalLikes(totalLikes + 1);
      showToast("Not Liked", "error");
      console.error("NOT LIKED : ", message);
    }

  }

  return (
    <div>
      <button
        onClick={isLiked ? handleDisLike : handleLike}
        className="flex items-center gap-2 text-red-500 hover:text-red-600"
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />} <span>{totalLikes.length}</span>
      </button>
    </div>
  )
}

export default LikeButton