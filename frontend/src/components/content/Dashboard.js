import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Dashboard() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  },[user, navigate])

  return (
    <div>
      <h1 className="text-center">Welcome {user && user.name}!</h1>
      <p>If this is your first visit, please see [User Guide] to learn more.</p>
    </div>
  )
}

export default Dashboard