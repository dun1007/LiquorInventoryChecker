import React from "react";
import classNames from "classnames";
import { Container } from "react-bootstrap";
import NavBar from "./Navbar";

import { useSelector, useDispatch } from 'react-redux'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Error from "./Error";
import Inventory from "./Inventory";
import Order from "./order/Order";
import Dashboard from "./Dashboard";
import Sales from "./Sales";
import Employees from "./Employees";
import UserGuide from "./UserGuide";
import Contact from "./Contact";
import Login from "./authentication/Login"
import Register from "./authentication/Register"

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


class Content extends React.Component {
  
  render() {
    return (
      <Container
        fluid
        className={classNames("content", { "is-open": this.props.isOpen })}
      >
        <NavBar toggle={this.props.toggle} />
        <ToastContainer />
        <Router>
            <Routes>
                <Route path="/" element={<UserGuide />}/>
                {/*<Route path="/dashboard" element={<Dashboard />}/>*/}
                <Route path="/inventory" element={<Inventory />}/>
                <Route path="/order" element={<Order />}/>
                <Route path="/sales" element={<Sales />}/>
                <Route path="/employees" element={<Employees />}/>
                <Route path="/UserGuide" element={<UserGuide />}/>
                <Route path="/contact" element={<Contact />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/account" />
                <Route path="/logout" />
                <Route path="*" element={<Error />}/>
            </Routes>
        </Router>
      </Container>

    );
  }
}

export default Content;
