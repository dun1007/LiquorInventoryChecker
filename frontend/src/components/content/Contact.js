import React from 'react'
import { FaGithubSquare, FaLinkedin, FaMailBulk } from 'react-icons/fa';
import { Container, Row } from "react-bootstrap";

//www.linkedin.com/in/steve-can-do-it
//https://github.com/dun1007

function Contact() {
  return (
    <Container fluid>
      <Row className="mb-5">
          <a href="https://github.com/dun1007/Stockify-Inventory-Manager" rel="noreferrer" target="_blank"><FaGithubSquare className="contact-icon" size={100} />
          <h1>Source Code</h1></a>
      </Row>
      <Row className="mb-5">
        <a href="https://www.linkedin.com/in/steve-can-do-it/" rel="noreferrer" target="_blank"><FaLinkedin className="contact-icon" size={100} /><h1>LinkedIn</h1></a>
      </Row>
      <Row>
        <a href="mailto:hsyoo1080@gmail.com" rel="noreferrer" target="_blank"><FaMailBulk className="contact-icon" size={100} /><h1>Business Inquiry</h1></a>
      </Row>
    </Container>
  )
}

export default Contact