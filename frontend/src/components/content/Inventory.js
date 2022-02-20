import React from 'react'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { Table, InputGroup, FormControl, Modal, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit
} from "@fortawesome/free-solid-svg-icons";

function Inventory() {

  const [listOfAlcohols, addAlcohol] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [volume, setVolume] = useState(0);
  const [unit, setUnit] = useState(0);
  const [packaging, setPackaging] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  //fires instantly as page loads
  useEffect(() => {
    Axios.get("http://localhost:3001/getAlcohols").then((response) => {
      addAlcohol(response.data);
    });
  }, []);

  const addItem = () => {
    Axios.post("http://localhost:3001/addAlcohol", {
        name: name,
        type: type,
        volume: volume,
        unit: unit,
        packaging: packaging,
      }).then((response) => {
        addAlcohol([
          ...listOfAlcohols, 
          {
            name: name,
            type: type,
            volume: volume,
            unit: unit,
            packaging: packaging,
          }

        ])
        .catch(()=> {
          console.log("Error");
        });
      //alert("Added an item");
    });
  }

  const updateInventoryList = (value) => {
    Axios.get("http://localhost:3001/getAlcohols").then((response) => {
      //console.log(response.data.filter(item => item.name.includes(value))); 
    addAlcohol(response.data.filter(item => item.name.includes(value)));
    });
  }

  function closeAndAddItem() {
    handleClose();
    addItem();
  }

  return (
    <div>
      <div>
        <Button onClick={handleShow}>Add a product</Button>
      </div>
      <div className="inventorySearchBar">
        <InputGroup size="sm" className="mb-3">
          <FormControl 
            aria-label="Small" 
            aria-describedby="inputGroup-sizing-default" 
            placeholder="Filter items by name..."
            onChange={(event) => {
              updateInventoryList(event.target.value);
            }} 
          />
        </InputGroup>
      </div>
      <div className="inventoryDisplay">
        <Table responsive hover size="sm">
          <thead>
            <tr>
              <th colSpan={3}>Name</th>
              <th>Type</th>
              <th>Packaging</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          {listOfAlcohols.map(alcohol => {
            return (
              <tbody>
                <tr>
                  <td colSpan={3}>{alcohol.name}</td>
                  <td>{alcohol.type}</td>
                  <td>{alcohol.volume}mL ({alcohol.packaging}) (x{alcohol.unit})</td>
                  <td>1</td>
                  <td>
                    <Button size="sm" onClick={handleShow}>
                      <FontAwesomeIcon icon={faEdit}/>
                    </Button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
      </div>
      
      <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add/Edit a product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Product Name <input 
              type="text" 
              placeholder="Name..." 
              onChange={(event) => {
                setName(event.target.value);
              }}
            /><br />
            Product Type <input 
              type="text" 
              placeholder="Type..."           
              onChange={(event) => {
                setType(event.target.value);
              }}
            /><br />
            Individual Volume<input 
              type="number" 
              placeholder="Volume...(in mL)" 
              onChange={(event) => {
                setVolume(event.target.value);
              }}
            /><br />
            Minimum Unit<input 
              type="number" 
              placeholder="Unit..." 
              onChange={(event) => {
                setUnit(event.target.value);
              }}
            /><br />
            Packaging Type<input 
              type="text" 
              placeholder="Packaging type..." 
              onChange={(event) => {
                setPackaging(event.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={closeAndAddItem}>Save</Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Inventory