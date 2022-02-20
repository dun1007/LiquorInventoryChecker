import React from 'react'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { Table, InputGroup, FormControl, Modal, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

function Inventory() {

  const [listOfAlcohols, setListofAlcohols] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [volume, setVolume] = useState(0);
  const [unit, setUnit] = useState(0);
  const [packaging, setPackaging] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [netInventoryValue, setNetInventoryValue] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItemID, setCurrentItemID] = useState("");
  const handleAddClose = () => setShowAddModal(false);
  const handleAddShow = () => setShowAddModal(true);
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = () => setShowDeleteModal(true);
  const handleEditClose = () => setShowEditModal(false);
  const handleEditShow = () => setShowEditModal(true);

  //fires instantly as page loads
  useEffect(() => {
    Axios.get("http://localhost:3001/getAlcohols").then((response) => {
      setListofAlcohols(response.data);
      recalculateInventoryNetWorth();
    });
  }, []);

  const addItem = () => {
    Axios.post("http://localhost:3001/addAlcohol", {
        name: name,
        type: type,
        volume: volume,
        unit: unit,
        packaging: packaging,
        quantity: quantity,
        price: price
      }).then((response) => {
        //console.log(response.data);
        setListofAlcohols([
          ...listOfAlcohols, 
          {
            _id: response.data._id,
            name: name,
            type: type,
            volume: volume,
            unit: unit,
            packaging: packaging,
            quantity: quantity,
            price: price
          }
        ]);
        recalculateInventoryNetWorth();
    });

  }

  const editItem = () => {
    Axios.put("http://localhost:3001/updateAlcohol", {
        id: currentItemID,
        name: name,
        type: type,
        volume: volume,
        unit: unit,
        packaging: packaging,
        quantity: quantity,
        price: price
      }).then(()=> {
        setListofAlcohols(listOfAlcohols.map((item)=> {
          return item._id === currentItemID ? 
            {
              _id: currentItemID,
              name: name,
              type: type,
              volume: volume,
              unit: unit,
              packaging: packaging,
              quantity: quantity,
              price: price
            } 
            : item;
        }))
        recalculateInventoryNetWorth();
      });
  }

  const removeItem = () => {
    Axios.delete(`http://localhost:3001/deleteAlcohol/${currentItemID}`).then(()=> {
      setListofAlcohols(listOfAlcohols.filter((item)=> {
        return item._id != currentItemID;
      }));
      recalculateInventoryNetWorth();
    }); 
  }

  const updateInventoryList = (value) => {
    Axios.get("http://localhost:3001/getAlcohols").then((response) => {
    setListofAlcohols(response.data.filter(item => item.name.includes(value)));
    });
  }

  const recalculateInventoryNetWorth = () => {
    Axios.get("http://localhost:3001/getAlcohols").then((response) => {
      const newNetWorth = response.data.reduce((prev, next) => prev + next.price*next.quantity,0);
      setNetInventoryValue(newNetWorth);
    });
  }



  return (
    <div>
      <div>
        <p>Net Value of Inventory: ${netInventoryValue}</p>
        <Button onClick={handleAddShow} className="mb-3 product-input">
          Add a product
        </Button>
      </div>
      <div className="inventorySearchBar">
        <InputGroup size="sm" className="mb-3">
          <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-default" placeholder="Filter items by name..."
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
              <th>Price</th>
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
                  <td>{alcohol.quantity}</td>
                  <td>{alcohol.price}</td>
                  <td colSpan={2}> 
                    <Button size="sm" className="" variant="success" onClick={()=> {
                      setCurrentItemID(alcohol._id);
                      setName(alcohol.name);
                      setType(alcohol.type);
                      setVolume(alcohol.volume);
                      setUnit(alcohol.unit);
                      setPackaging(alcohol.packaging);
                      setPrice(alcohol.price);
                      setQuantity(alcohol.quantity);
                      handleEditShow(); 
                    }}>
                      <FontAwesomeIcon icon={faEdit} className="fa-solid" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={()=>{
                      setCurrentItemID(alcohol._id);
                      handleDeleteShow(); 
                    }}>
                      <FontAwesomeIcon icon={faTrashAlt} className="fa-solid" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
      </div>
      
      <Modal show={showAddModal} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product Name <input className="product-input" type="text" placeholder="Name of Product..." 
            onChange={(event) => {
              setName(event.target.value);
            }}
          /><br /><br />
          Product Type <input className="product-input" type="text" placeholder="Beer/Wine/Liquor/etc..."           
            onChange={(event) => {
              setType(event.target.value);
            }}
          /><br /><br />
          Individual Volume<input className="product-input" type="number" placeholder="Volume...(in mL)" 
            onChange={(event) => {
              setVolume(event.target.value);
            }}
          /><br /><br />
          Minimum Unit<input className="product-input" type="number" placeholder="15(Can)/1(Single)/etc..." 
            onChange={(event) => {
              setUnit(event.target.value);
            }}
          /><br /><br />
          Packaging Type<input className="product-input" type="text" placeholder="Bottle/Can/etc..." 
            onChange={(event) => {
              setPackaging(event.target.value);
            }}
          /><br /><br />
          Price<input className="product-input" type="number" placeholder="Price..." 
            onChange={(event) => {
              setPrice(event.target.value);
            }}
          /><br /><br />
          Quantity<input className="product-input" type="number" placeholder="Number of products..." 
            onChange={(event) => {
              setQuantity(event.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=> {
            handleAddClose();
          }}>Close</Button>
          <Button variant="primary" onClick={()=> {
            handleAddClose();
            addItem();
          }}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product Name <input className="product-input" type="text" placeholder="Name of Product..." 
            value={`${name}`}
            onChange={(event) => {
              setName(event.target.value);
            }}
          /><br /><br />
          Product Type <input className="product-input" type="text" placeholder="Beer/Wine/Liquor/etc..."           
            value={`${type}`}
            onChange={(event) => {
              setType(event.target.value);
            }}
          /><br /><br />
          Individual Volume<input className="product-input" type="number" placeholder="Volume...(in mL)" 
            value={`${volume}`}
            onChange={(event) => {
              setVolume(event.target.value);
            }}
          /><br /><br />
          Minimum Unit<input className="product-input" type="number" placeholder="15(Can)/1(Single)/etc..." 
            value={`${unit}`}
            onChange={(event) => {
              setUnit(event.target.value);
            }}
          /><br /><br />
          Packaging Type<input className="product-input" type="text" placeholder="Bottle/Can/etc..." 
            value={`${packaging}`}
            onChange={(event) => {
              setPackaging(event.target.value);
            }}
          /><br /><br />
          Price<input className="product-input" type="number" placeholder="Price..." 
            value={`${price}`}
            onChange={(event) => {
              setPrice(event.target.value);
            }}
          /><br /><br />
          Quantity<input className="product-input" type="number" placeholder="Number of products..." 
            value={`${quantity}`}
            onChange={(event) => {
              setQuantity(event.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>Close</Button>
          <Button variant="primary" onClick={()=> {
            handleEditClose();
            editItem();
          }}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>Close</Button>
          <Button variant="danger" onClick={() => {
            handleDeleteClose();
            removeItem();
          }}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Inventory