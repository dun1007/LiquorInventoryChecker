import React, { Component } from 'react'
import { Table, Button, InputGroup, FormControl, Modal, Popover, OverlayTrigger, Tooltip, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios'

export default class OrderReceived extends Component {
	constructor(props) {
	super(props);
	this.state = {
		user: props.user, // User credentials
		week: 0,
		year: 0,
		listOfItems: [],	// List of items in add form
		listOfItemsToOrder: [], // List of items in item sold list
		currentItemID: "",
		item: {
			name: '',
			type: '',
			volume: '',
			unit: '',
			packaging: '',
			price: '',
			quantity: '',
		},
		//Modal Toggles
		addModal: false,
		warningModal: false,
		quantityOfItemToAdd: 0,
	}
  }

  componentDidUpdate = () => {
		if (this.state.week !== this.props.week || this.state.year !== this.props.year) {
			this.setState({week: this.props.week, year: this.props.year}, () => {
				this.getItemsToOrder()
			})
		}
	}

  componentDidMount = () => {
		this.setState({week: this.props.week, year: this.props.year}, () => {
			this.getProductToOrder() // fetch inventory
			this.getItemsToOrder() // fetch list of items added
		})
	}

	getAuthHeader = () => { return {headers: { authorization: `Bearer ${this.state.user && this.state.user.token}`}} }

	toggleAddModal = () => {
		if (!this.state.addModal) {
			this.filterAddProductList("")
		}
		this.setState({addModal: !this.state.addModal})
	}
  toggleWarningModal = () => { this.setState({warningModal: !this.state.warningModal}) }


  updateQuantity = (event, item) => {
		if (event.type === "change") {
			this.setState({item: {
				...item,
				quantity: Number(event.target.value)
			}})
		} else if (event.type === "blur" && event.target.value) {
			Number(event.target.value) === 0 ? this.deleteItem(item._id) : this.editItemQuantity()
		}
	}

	editItemQuantity = () => {
		Axios.put(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/order`, this.state.item, this.getAuthHeader())
	  .then(() => {
			this.getItemsToOrder()
		})
	}

	addItemQuantity = () => {
		let isDuplicate = false
		this.state.listOfItemsToOrder.map((item) => {
			if (item._id === this.state.item._id) {
				isDuplicate = true
			}
		})

		isDuplicate ? this.editItemQuantity() :
			Axios.post(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/order`, this.state.item, this.getAuthHeader()).then(() => {
				this.getItemsToOrder()
		})
	}

	addBatchItems = (items) => {
		Axios.post(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/order`, items, this.getAuthHeader()).then(() => {
			this.getItemsToOrder()
		})
	}

	getItemsToOrder = () => {
		Axios.get(`http://localhost:5000/api/weekly/${this.props.year}/${this.props.week}/order`, this.getAuthHeader()).then((response) => {
			this.setState({listOfItemsToOrder: response.data})
		});
	}

	getProductToOrder = () => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader(this.state.user)).then((response) => {
			this.setState({ listOfItems: response.data })
		});
	}

	deleteItem = (itemID) => {
		Axios.delete(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/order/${itemID}`, this.getAuthHeader()).then((response) => {
			this.getItemsToOrder()
		})
	}

	filterAddProductList = (value) => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader()).then((response) => {
			this.setState({listOfItems: response.data.filter(item => item.name.includes(value))})
		});
	}

  suggestNextOrder = async () => {
    let itemsSold, orderReceived, inventory
    
    await Axios.get(`http://localhost:5000/api/weekly/${this.props.year}/${this.props.week}/orders_received`, this.getAuthHeader())
      .catch(err => {this.toggleWarningModal(); throw err})
      .then((response) => {orderReceived = response.data})
    await Axios.get(`http://localhost:5000/api/weekly/${this.props.year}/${this.props.week}/items_sold`, this.getAuthHeader())
      .catch(err => {this.toggleWarningModal(); throw err})
      .then((response) => {itemsSold = response.data})
    await Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader())
      .catch(err => {this.toggleWarningModal(); throw err})
      .then((response) => {inventory = response.data});

    if (!itemsSold || !orderReceived || !inventory) {
      this.toggleWarningModal()
    } else {
      const k = 0.5
      const result = []
      itemsSold.map((item) => {
        let or = this.findMatchingIdItem(item._id, orderReceived) || 0
        let inv = this.findMatchingIdItem(item._id, inventory) || 0
        let diff = item.quantity - or 
        item.quantity = Math.floor(diff + (1-inv/25)) 

        if (item.quantity > 0) { result.push(item) }
      })
      await this.flushItems()
      await this.addBatchItems(result)
    }
  }

  flushItems = () => {
    Axios.delete(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/order`, this.getAuthHeader())
    
  }

  findMatchingIdItem = (id, arr) => {
    for (let i=0; i<arr.length; i++) {
      if (id === arr[i]._id) {
        return arr[i].quantity
      }
    }
    return null
  }

	toastForDemo = () => {
		return (
		  <Toast className="m-3">
			<Toast.Header closeButton={false}>
			  <a href="https://github.com/dun1007/Stockify-Inventory-Manager" rel="noreferrer" target="_blank">
				<strong className="me-auto">Message from Steve</strong>
			  </a>
			  <small className="ms-auto">Just now</small>
			</Toast.Header>
			<Toast.Body>
			  <strong>Time to make an order for next week!</strong> Click on  
			  <strong> [Suggest an order]</strong> button, which will auto-fill next order based on previous two 
				sections and your inventory stock. This sets you up for must-order items, and then you can add/edit few 
				more items as you desire.<br />
				That's it for the demo tour. Thanks for following through! If you want to reset database and try other 
				 stuffs, logout and re-log with demo option which will flush everything and re-populate data for you.
			</Toast.Body>
		  </Toast>
		)
	}

  render() {
		const popover = (
			<Popover id="popover-basic">
				<Popover.Header as="h3">Enter Qty.</Popover.Header>
				<Popover.Body>
					<FormControl placeholder="Qty." type="number" className="input-number-popover"
						onChange={(event) => this.updateQuantity(event, this.state.item)}/><br />
						<Button variant="primary" type="submit" 
						onClick={()=> {
							this.addItemQuantity();
							this.toggleAddModal();
						}}>Submit</Button>
				</Popover.Body>
			</Popover>
		);

		const suggestReminder = (props) => (
			<Tooltip id="button-tooltip" {...props}>
				Auto-fill table based on your items sold, orders received, and inventory stock.
		  </Tooltip>
		)
		return (
			<div>
				<Button className="m-3" onClick={this.toggleAddModal}>
					Add item to next order
				</Button>
				<OverlayTrigger placement="bottom" delay={{show:200, hide:200}} overlay={suggestReminder}>
					<Button className="m-3" onClick={this.suggestNextOrder}>
						Suggest an order
					</Button>
				</OverlayTrigger>
				{((this.state.user && this.state.user.name) === "Demo Account") ? this.toastForDemo() : <p />}
				<Table responsive hover size="sm">
					<thead>
						<tr>
							<th colSpan={2}>Name</th>
							<th></th>
							<th>Properties</th>
							<th>Amt.</th>
							<th>Edit</th>
							<th>Del.</th>
						</tr>
					</thead>
					<tbody>
						{this.state.listOfItemsToOrder.map(item => {
							return (
								<tr key={"order-itemsSold-" + item._id}>
									<td colSpan={2}>{item.name}</td>
									<td></td>
									<td>{item.type}, {item.volume}mL ({item.packaging}) (x{item.unit})</td>
									<td>{item.quantity}</td>
									<td>
										<FormControl type="number" className="input-number"
											onChange={(event) => this.updateQuantity(event, item)}
											onBlur={(event) => this.updateQuantity(event, item)}
										/>
									</td>
									<td>
										<Button size="sm" variant="danger" onClick={()=>{
												this.deleteItem(item._id)
											}}>
											<FontAwesomeIcon icon={faTrashAlt} className="fa-solid" />
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>

				<Modal name="add" show={this.state.addModal} onHide={this.toggleAddModal} enforceFocus={false}>
					<Modal.Header closeButton>
					<Modal.Title>Add to next order</Modal.Title>
					</Modal.Header>
					<Modal.Body>
							<InputGroup size="sm" className="mb-3">
									<FormControl aria-label="Small" aria-describedby="inputGroup-sizing-default" placeholder="Filter items by name..."
											onChange={(event) => {this.filterAddProductList(event.target.value)}}/>
							</InputGroup>

							<Table responsive hover size="sm">
									<thead>
										<tr>
											<th colSpan={2}>Name</th>
											<th></th>
											<th>Properties</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{this.state.listOfItems.map(item => {
											return (
												<tr key={"order-itemsSold-addProduct-" + item._id}>
													<td colSpan={2}>{item.name}</td>
													<td></td>
													<td>{item.type}, {item.volume}mL ({item.packaging}) (x{item.unit})</td>
													<td>
														<OverlayTrigger trigger="click" placement="left" overlay={popover}>
															<Button size="sm" variant="success" onClick={(e)=> {
																this.setState({item: item})
															}}><FontAwesomeIcon icon={faPlus} className="fa-solid" /></Button>
														</OverlayTrigger>
													</td>
												</tr>
											);
										})}
									</tbody>
							</Table>

					</Modal.Body>
					<Modal.Footer>
					<Button variant="secondary" onClick={this.toggleAddModal}>Close</Button>
					<Button variant="primary"  onClick={this.toggleAddModal}>Save</Button>
					</Modal.Footer>
				</Modal>

				<Modal id="modal-warning" show={this.state.warningModal} onHide={this.toggleWarningModal}>
					<Modal.Body>
						You must have some items in [Items Sold] and [Order Received] sections to use this feature.
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.toggleWarningModal}>
							OK
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
  }
}
