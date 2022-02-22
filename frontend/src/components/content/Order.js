import React from 'react'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { Table, Button, Modal, InputGroup, FormControl, ListGroup} from 'react-bootstrap';

/* 
{
  _id: (hex)
  name: String
  soldAmt: Number
}
*/
function Order() {
  let tempListOfItemsSold = {};
  const [quantitySold, setQuantitySold] = useState(0);
  const [listOfItemsSoldInModal, setListOfItemsSoldInModal] = useState([]);
  const [listOfItemsSold, setListOfItemsSold] = useState({});
  //Modal
  const [showAddtoSalesModal, setShowAddtoSalesModal] = useState(false);
  const handleAddtoSalesClose = () => setShowAddtoSalesModal(false);
  const handleAddtoSalesShow = () => setShowAddtoSalesModal(true);

  const addItemListToSales = () => {
    Axios.get("http://localhost:5000/alcohols").then((response) => {
      setListOfItemsSoldInModal(response.data);
    });  
  }

  const filterSalesList = (value) => {
    Axios.get("http://localhost:5000/alcohols").then((response) => {
      setListOfItemsSoldInModal(response.data.filter(item => item.name.includes(value)));
    });
  }

  //Temporarily store item and quantity sold as key value pair. Since key is unique, we never get duplicate item quantity.
  const addToListOfItemsSold = (id, name, quantity) => {
    const q = Number(quantity);
    tempListOfItemsSold = {...tempListOfItemsSold, [id]:q};    
  }

  //When we actually add item to sold list, set the data as state and initialize temp for future use
  const saveListOfItemsSold = () => {
    setListOfItemsSold(tempListOfItemsSold);
    tempListOfItemsSold = {};
    console.log(listOfItemsSold);
  }
  
  //JSX cannot use object. Change data to array of objects before putting them out for display.
  function convertToArrayOfObjects(data) {
    const newArr = [];
    for (var key in listOfItemsSold) {
      newArr.push({_id: key, quantity: listOfItemsSold[key]});
    }
    return newArr
  }

  function findItemByID(id) {
    Axios.get(`http://localhost:5000/alcohols/find/${id}`).then((response) => {
      const name = response.data[0].name;
      console.log(name);
      //setListOfItemsSoldInModal(response.data.filter(item => item.name.includes(value)));
    });
  }

  useEffect(() => {
    //addItemListToSales();
  });


  return (
    <div>
      <div>
        Order Details for the Week of: 123123
      </div>
      <Button className="mb-3 product-" 
            onClick={()=> {findItemByID("6213248b9cc37c84ba9201ed");}}
      >xdxd</Button>
      <Button className="mb-3 product-" 
            onClick={()=> {handleAddtoSalesShow(); addItemListToSales();}}
      >Add an item</Button>
      <div className="sales-container"> 
        <div className="sales-display">
          <h2>Items Sold</h2>
          <Table responsive hover size="sm">
            <tbody>
              {convertToArrayOfObjects(listOfItemsSold).map(item => {
                return (
                  <tr>
                    <td>{item._id}</td>
                    <td>{item.quantity}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div> 
        <div className="sales-display">
          <h2>Order Received</h2>
          <ListGroup>
              <ListGroup.Item>Cras justo odio</ListGroup.Item>
              <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
              <ListGroup.Item>Morbi leo risus</ListGroup.Item>
              <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
              <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
            </ListGroup>
        </div>
      </div>

      <Modal show={showAddtoSalesModal} onHide={()=> {handleAddtoSalesClose(); tempListOfItemsSold={}}}>
        <Modal.Header closeButton>
          <Modal.Title>Enter the amount sold</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup size="sm" className="mb-3">
            <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-default" placeholder="Filter items by name..."
              onChange={(event) => {
                filterSalesList(event.target.value);
              }}
            />
          </InputGroup>
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th colSpan={3}>Name</th>
                <th></th>
                <th></th>
                <th>Type</th>
                <th>Sold Amt.</th>
              </tr>
            </thead>
            <tbody>
            {listOfItemsSoldInModal.map(item => {
              return (
                <tr>
                  <td colSpan={3}>{item.name}</td>
                  <td></td>
                  <td></td>
                  <td>{item.type} ({item.volume}mL, {item.packaging}, x{item.unit}</td>
                  <td><input className="quantity-sold-input" type="number" onChange={(event) => {
                    addToListOfItemsSold(item._id, item.name, event.target.value);
                  }}></input></td>
                </tr>
              )
            })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            handleAddtoSalesClose(); tempListOfItemsSold = {};}}
          >Close</Button> 
          <Button variant="primary" onClick={()=> {
            handleAddtoSalesClose(); saveListOfItemsSold();}}
          >Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Order
