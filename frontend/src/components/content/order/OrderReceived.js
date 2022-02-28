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
			listOfItemsReceived: [], // List of items in item sold list
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
				this.getItemsReceived()
			})
		}
	}

  componentDidMount = () => {
		this.setState({week: this.props.week, year: this.props.year}, () => {
			this.getProductToReceive() // fetch inventory
			this.getItemsReceived() // fetch list of items added
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
		Axios.put(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/orders_received`, this.state.item, this.getAuthHeader())
	  .then(() => {
			this.getItemsReceived()
		})
	}

	addItemQuantity = () => {
		let isDuplicate = false
		this.state.listOfItemsReceived.map((item) => {
			if (item._id === this.state.item._id) {
				isDuplicate = true
			}
		})

		isDuplicate ? this.editItemQuantity() :
			Axios.post(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/orders_received`, this.state.item, this.getAuthHeader()).then(() => {
				this.getItemsReceived()
		})
	}

	addBatchItems = (items) => {
		Axios.post(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/orders_received`, items, this.getAuthHeader()).then(() => {
			this.getItemsReceived()
		})
	}

	getItemsReceived = () => {
		Axios.get(`http://localhost:5000/api/weekly/${this.props.year}/${this.props.week}/orders_received`, this.getAuthHeader()).then((response) => {
			this.setState({listOfItemsReceived: response.data})
		})
	}

	getProductToReceive = () => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader(this.state.user)).then((response) => {
			this.setState({ listOfItems: response.data })
		})
	}

	deleteItem = (itemID) => {
		Axios.delete(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/orders_received/${itemID}`, this.getAuthHeader()).then((response) => {
			this.getItemsReceived()
		})
	}

	filterAddProductList = (value) => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader()).then((response) => {
			this.setState({listOfItems: response.data.filter(item => item.name.includes(value))})
		});
	}

	autofillOrderReceived = () => {
		let week, year
		if (this.state.week === 1) {
			week = 52
			year = this.state.year-1
		} else {
			week = this.state.week-1
			year = this.state.year
		}
		console.log("looking for " + week + " " + year)
		Axios.get(`http://localhost:5000/api/weekly/${year}/${week}/order`, this.getAuthHeader())
			.catch((err) => {
			this.toggleWarningModal()
			throw err
		}).then((response) => {
			(response.data.length == 0) ? this.toggleWarningModal() :
				//Flush list and add data from last week
				Axios.delete(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/orders_received`, this.getAuthHeader())
				this.setState({listOfItemsReceived: response.data})
				this.addBatchItems(response.data)
		})
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
			  <strong>Uhm... what items did I get for this week's delivery? </strong> No worries, just click on 
			  <strong> [Auto-fill with last week's order]</strong> button, and that will get the job done for you.
			  <br /> When you are done, go to <strong>[Next Order]</strong> tab.
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

		const autofillReminder = (props) => (
			<Tooltip id="button-tooltip" {...props}>
				If you have made order last week, you can import it and auto-fill.
		  </Tooltip>
		)

		return (
			<div>
				<Button className="m-3" onClick={this.toggleAddModal}>
					Add item to order received
				</Button>
				<OverlayTrigger placement="bottom" delay={{show:200, hide:200}} overlay={autofillReminder}>
					<Button className="m-3" onClick={this.autofillOrderReceived}>
						Auto-fill with last week's order
					</Button>
				</OverlayTrigger>
				{((this.state.user && this.state.user.name) === "Demo Account") ? this.toastForDemo() : <p />}
				<Table responsive hover size="sm">
					<thead>
						<tr>
							<th colSpan={2}>Name</th>
							<th></th>
							<th>Properties</th>
							<th>Sold</th>
							<th>Edit</th>
							<th>Del.</th>
						</tr>
					</thead>
					<tbody>
						{this.state.listOfItemsReceived.map(item => {
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
					<Modal.Title>Add orders received</Modal.Title>
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
						You do not have order data from last week! Failed to autofill.
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
