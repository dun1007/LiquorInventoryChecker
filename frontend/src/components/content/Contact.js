import React from 'react'
import { FaGithubSquare, FaLinkedin, FaMailBulk } from 'react-icons/fa';
import { Button } from "react-bootstrap";

//www.linkedin.com/in/steve-can-do-it
//https://github.com/dun1007

function Contact() {
  return (
    <div>
        <a href="https://github.com/dun1007/Stockify-Inventory-Manager" rel="noreferrer" target="_blank"><FaGithubSquare className="contact-icon m-5" size={100} /></a>
        <a href="https://www.linkedin.com/in/steve-can-do-it/" rel="noreferrer" target="_blank"><FaLinkedin className="contact-icon m-5" size={100} /></a>
        <a href="mailto:hsyoo1080@gmail.com" rel="noreferrer" target="_blank"><FaMailBulk className="contact-icon m-5" size={100} /></a>
    </div>
  )
}

export default Contact