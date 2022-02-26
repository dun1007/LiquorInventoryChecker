import React from 'react'
import { Accordion } from "react-bootstrap";

function FAQ() {
  return (
    <Accordion >
      <Accordion.Item eventKey="0">
        <Accordion.Header><h3>Is this free?</h3></Accordion.Header>
        <Accordion.Body className="accordion-body">
          Yes. Free for life. 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h3>How do I get started?</h3></Accordion.Header>
        <Accordion.Body className="accordion-body">
          New to Stockify? You will want to get some items in the inventory to get started. 
          Go to [Inventory] and add your alcohol stocks. <br /><br />You may add, edit, or delete 
          your alcohol items in inventory
          whenever you like, but it is recommended that you don't manipulate it manually
          after first inventory count if you want to take advantage of our Order Suggestion 
          service.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><h3>How do I use Order Suggestion feature?</h3></Accordion.Header>
        <Accordion.Body className="accordion-body">
          Browse to [Manage Order] section. There, Stockify keeps track of your weekly orders and 
          suggests you the next order amount based on items sold last week. Populate [Items Sold]
          with your last week's sales data. You can populate [Order Received] the same way, or 
          auto-fill it if you have last week's order record. <br /><br /> With these 2 forms filled,
          Stockify will suggest you the order for next week. You may follow it through, or edit it if
           you like. Once you are done, finalize the weekly order to enjoy other features such as 
           sales visualization.<br /><br /> Future versions will support many advanced features such
           as seasonal suggestion and machine-learning suggestion. 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h3>I got a glitch. How can I report it?</h3></Accordion.Header>
        <Accordion.Body className="accordion-body">
          If you are familiar with technology, please post an issue @ GitHub. You may also 
          check my [Contact] in sidebar. 
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default FAQ