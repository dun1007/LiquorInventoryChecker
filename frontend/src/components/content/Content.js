import React from "react";
import classNames from "classnames";
import { Container } from "react-bootstrap";
import NavBar from "./Navbar";
import Error from "./Error";
import Inventory from "./Inventory";
import Order from "./Order";
import Dashboard from "./Dashboard";
import Sales from "./Sales";
import Employees from "./Employees";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Account from "../auth/Account";
import Logout from "../auth/Logout";

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

class Content extends React.Component {
  render() {
    return (
      <Container
        fluid
        className={classNames("content", { "is-open": this.props.isOpen })}
      >
        <NavBar toggle={this.props.toggle} />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/Dashboard" element={<Dashboard />}/>
            <Route path="/Inventory" element={<Inventory />}/>
            <Route path="/Order" element={<Order />}/>
            <Route path="/Sales" element={<Sales />}/>
            <Route path="/Employees" element={<Employees />}/>
            <Route path="/FAQ" element={<FAQ />}/>
            <Route path="/Contact" element={<Contact />}/>
            <Route path="/Account" element={<Account />}/>
            <Route path="/Logout" element={<Logout />}/>
            <Route path="*" element={<Error />}/>
          </Routes>
        </Router>
      </Container>

    );
  }
}

export default Content;
