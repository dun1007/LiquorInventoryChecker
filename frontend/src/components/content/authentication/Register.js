import { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, register, reset } from '../../../features/auth/authSlice'
import { FaUser } from 'react-icons/fa'
import Spinner from './Spinner'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const onChange = (event) => {
    event.persist()
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  

  const onSubmit = (e) => {
    e.preventDefault()
    // Check confirm p/w
    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        name,
        email,
        password,
      }

      dispatch(register(userData))
    }
  }

  const onDemoClick = (e) => {
    e.preventDefault()

    const userData = {
      email: "demo@demo.com",
      password: "demo",
    }

    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='login-form'>
      <div className='login-heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account to continue.</p>
      </div>

      <div>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Your Full Name</Form.Label>
            <Form.Control type="name" name="name" onChange={onChange} placeholder="Enter your full name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" onChange={onChange} placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" onChange={onChange} placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password2" name="password2" onChange={onChange} placeholder="Confirm Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
          </Form.Group>

          <Button variant="primary" type="submit" className="login-submit-button">
            Submit
          </Button>
        </Form>
        
        <div className="text-center">
          <Button variant="secondary" className="login-demo-button mt-5" onClick={onDemoClick}>
            Try out with Demo Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Register
