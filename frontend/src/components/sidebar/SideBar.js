import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
  faTable,
  faWarehouse,
  faTruck
} from "@fortawesome/free-solid-svg-icons";
import SubMenu from "./SubMenu";
import { Nav, Button, Container } from "react-bootstrap";
import classNames from "classnames";

class SideBar extends React.Component {
  render() {
    return (
      <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <Button
            variant="link"
            onClick={this.props.toggle}
            style={{ color: "#fff" }}
            className="mt-4"
          >
          </Button>
          <div><h3>Stockify</h3></div>
        </div>

        <div id="top-nav-items">
          <Nav className="flex-column pt-2">
            <p className="ml-3">Menus</p>

            <Nav.Item>
              <Nav.Link href="/">
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                Dashboard
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link href="/">
                <FontAwesomeIcon icon={faWarehouse} className="mr-2" />
                Inventory
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link href="/">
                <FontAwesomeIcon icon={faTruck} className="mr-2" />
                Create Order
              </Nav.Link>
            </Nav.Item>

            <SubMenu
              title="Manage"
              icon={faCopy}
              items={["Sales", "Employees"]}
            />
          </Nav>
        </div>
        <div id="bot-nav-items">
          <Nav className="flex-column pt-2">
            <Nav.Item>
              <Nav.Link href="/">
                <FontAwesomeIcon icon={faQuestion} className="mr-2" />
                FAQ
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link href="/">
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Contact
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    );
  }
}

export default SideBar;
