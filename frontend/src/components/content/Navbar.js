import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAlignLeft, } from "@fortawesome/free-solid-svg-icons"
import { Navbar, Button, Nav } from "react-bootstrap"
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
//import { Link, useNavigate } from 'react-router-dom'

class NavBar extends React.Component {
  render() {

    return (
      <div>
        <Navbar
          bg="light"
          className="navbar shadow-sm p-3 mb-5 bg-white rounded"
          expand
        >
          <Button variant="outline-info" onClick={this.props.toggle}>
            <FontAwesomeIcon icon={faAlignLeft} />
          </Button>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <NavbarPersonal />
        </Navbar>
      </div>
    );
  }
}

//Handles register/login/logout display based on user state
function NavbarPersonal() {

  //const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    //navigate('/')
  }
  return (
    <Nav className="ml-auto" navbar>
      {user ? (
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav.Link href="/logout" onClick={onLogout}><FaSignOutAlt />Logout</Nav.Link>
        </Navbar.Collapse>
      ) : (
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav.Link href="/login"><FaSignInAlt />Login</Nav.Link>
          <Nav.Link href="/register"><FaUser />Register</Nav.Link>
          </Navbar.Collapse>
      )}
    </Nav>  
  )
}


export default NavBar;
