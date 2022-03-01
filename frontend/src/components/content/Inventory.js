import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Axios from 'axios'
import { Table, InputGroup, FormControl, Modal, Button, Toast} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function Inventory() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)

  const [listOfItems, setListOfItems] = useState([])
  const [currentItemID, setCurrentItemID] = useState("")
  const [item, setItem] = useState({
    name: '',
    type: '',
    volume: '',
    unit: '',
    packaging: '',
    price: '',
    quantity: '',
  })
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    delete: false,
  })

  const changeHandler = (e) => {
    e.persist()
    setItem((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: e.target.value
      }
    })
  }

  const toggleModal = (modal) => {
    setOpenModal({ ...openModal, [modal]: !openModal[modal] });
  }


  
  useEffect(() => {
    // Check if user is logged in first
    if (!user) {
      navigate('/login')
    } else {
      Axios.post("/api/inventory/create", null , getAuthHeader())
      getItems()
    }
  }, [user, navigate]);

  const getAuthHeader = () => { return {headers: { authorization: `Bearer ${user.token}`}} }

  const getItems = () => {
    Axios.get("/api/inventory", getAuthHeader()).then((response) => {
      setListOfItems(response.data);
    });
  }
  const addItem = () => {
    Axios.post("/api/inventory", item, getAuthHeader()).then((response) => {
      getItems()
    })
  }

  const editItem = () => {
    Axios.put(`/api/inventory/${currentItemID}`, item, getAuthHeader()).then((response) => {
      let items = [...listOfItems]
      for (let i = 0; i < items.length; i++ ) {
        if (items[i]._id === item._id) {
          items[i] = item
          break
        }
      }
      getItems()
    })
  }

  const deleteItem = () => {
    Axios.delete(`/api/inventory/${currentItemID}`, getAuthHeader()).then((response) => {getItems()})
    
  }

  const filterItemList = (value) => {
    Axios.get("/api/inventory", getAuthHeader()).then((response) => {
      setListOfItems(response.data.filter(item => item.name.includes(value)));
    });
  }

  const toastForDemo = () => {
    return (
      <Toast className="m-3 glow-effect-msg">
        <Toast.Header closeButton={false}>
          <a href="https://github.com/dun1007/Stockify-Inventory-Manager" rel="noreferrer" target="_blank">
            <strong className="me-auto">Message from Steve</strong>
          </a>
          <small className="ms-auto">Just now</small>
        </Toast.Header>
        <Toast.Body>
          I put some items in your inventory for you. Feel free to 
          fiddle around with them. Those are randomly generated for demo purpose by the way,
          so no, you wouldn't sell a bottle of Dom Perignon for $5 :) <br /> Once you are done, please
          head to <strong>[Manage Order]</strong> to make your first order.
        </Toast.Body>
      </Toast>
    )
  }

  return (
    <div>
      {((user && user.name) === "Demo Account") ? toastForDemo() : <p />}
      <div>
        <Button onClick={()=> toggleModal("add")} className="mb-3 product-input">
          Add a product
        </Button>
        {/*<Button onClick={()=> addRandomItem()} className="mb-3 product-input">
          hehexd
        </Button>*/}
      </div>
      <div className="inventorySearchBar">
        <InputGroup size="sm" className="mb-3">
          <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-default" placeholder="Filter items by name..."
            onChange={(event) => {filterItemList(event.target.value)}} 
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
          <tbody>
          {listOfItems.map(item => {
            return (
              <tr key={item._id}>
                <td colSpan={3}>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.volume}mL ({item.packaging}) (x{item.unit})</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td colSpan={2}> 
                  <Button size="sm" variant="success" onClick={(e)=> {
                    toggleModal("edit"); 
                    setCurrentItemID(item._id);
                    setItem(item);
                  }}>
                    <FontAwesomeIcon icon={faEdit} className="fa-solid" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={()=>{
                    toggleModal("delete");
                    setCurrentItemID(item._id);
                  }}>
                    <FontAwesomeIcon icon={faTrashAlt} className="fa-solid" />
                  </Button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </div>
      
      <Modal name="add" show={openModal.add} onHide={() => toggleModal("add")}>
        <Modal.Header closeButton>
          <Modal.Title>Add a product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product Name <input className="product-input" type="text" name="name" placeholder="Name of Product..." 
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Product Type <input className="product-input" type="text" name="type" placeholder="Beer/Wine/Liquor/etc..."           
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Individual Volume<input className="product-input" type="number" name="volume" placeholder="Volume...(in mL)" 
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Minimum Unit<input className="product-input" type="number" name="unit" placeholder="15(Can)/1(Single)/etc..." 
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Packaging Type<input className="product-input" type="text" name="packaging" placeholder="Bottle/Can/etc..." 
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Price<input className="product-input" type="number" name="price" placeholder="Price..." 
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Quantity<input className="product-input" type="number" name="quantity" placeholder="Number of products..." 
            onChange={(e) => {changeHandler(e);}} /><br /><br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=> toggleModal("add")}>Close</Button>
          <Button variant="primary"  onClick={()=> {toggleModal("add"); addItem();}}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal name="edit" show={openModal.edit} onHide={() => toggleModal("edit")}>
        <Modal.Header closeButton>
          <Modal.Title>Edit a product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product Name <input className="product-input" name="name" type="text" placeholder="Name of Product..." 
            value={`${item.name}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Product Type <input className="product-input" name="type" type="text" placeholder="Beer/Wine/Liquor/etc..."           
            value={`${item.type}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Individual Volume<input className="product-input" name="volume" type="number" placeholder="Volume...(in mL)" 
            value={`${item.volume}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Minimum Unit<input className="product-input" name="unit" type="number" placeholder="15(Can)/1(Single)/etc..." 
            value={`${item.unit}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Packaging Type<input className="product-input" name="packaging" type="text" placeholder="Bottle/Can/etc..." 
            value={`${item.packaging}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Price<input className="product-input" name="price" type="number" placeholder="Price..." 
            value={`${item.price}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
          Quantity<input className="product-input" name="quantity" type="number" placeholder="Number of products..." 
            value={`${item.quantity}`}
            onChange={(e) => {changeHandler(e);}} /><br /><br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=> toggleModal("edit")}>Close</Button>
          <Button variant="primary" onClick={()=> {toggleModal("edit"); editItem();}}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal name="delete" show={openModal.delete} onHide={() => toggleModal("delete")}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleModal("delete")}>Close</Button>
          <Button variant="danger" onClick={() => {toggleModal("delete"); deleteItem();}}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Inventory