import { useParams } from 'react-router-dom'

function Profile() {
  const { id } = useParams<{ id: string }>() // read the dynamic param

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profile Page</h1>
      <p>User ID: {id}</p>
    </div>
  )
}

export default Profile
