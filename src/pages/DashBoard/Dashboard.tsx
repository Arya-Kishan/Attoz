import AllPosts from './components/AllPosts';
import Creators from '../../components/Creators';
import Footer from '../../components/Footer';
import { useAppSelector } from '../../store/storeHooks';
import SearchedPosts from './components/SearchedPosts';
import SearchedUser from './components/SearchedUser';

const Dashboard = () => {

  const { searchedTab } = useAppSelector(store => store.post);

  return (
    <div className='w-screen h-full min-h-[calc(100vh-80px)] overflow-x-hidden'>

      {searchedTab == "post" && <AllPosts />}
      {searchedTab == "search" && <SearchedPosts />}
      {searchedTab == "user" && <SearchedUser />}

      <Creators />
      <Footer />
    </div>
  )
}

export default Dashboard