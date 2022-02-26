import React, { Component } from 'react'
import { Table, Button, InputGroup, FormControl, Modal, Popover, OverlayTrigger, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios'


export default class ItemsSold extends Component {
	constructor(props) {
			super(props);
			this.state = {
					user: props.user, // User credentials
					week: 0,
					year: 0,
					listOfItems: [],	// List of items in add form
					listOfItemsAdded: [], // List of items in item sold list
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
					editModal: false,
					deleteModal: false,
					quantityOfItemToAdd: 0,
			}
	}   
	
	componentDidUpdate = () => {
		if (this.state.week !== this.props.week || this.state.year !== this.props.year) {
			this.setState({week: this.props.week, year: this.props.year})
		}
	}

	componentDidMount = () => {
		this.setState({week: this.props.week, year: this.props.year}, () => {
			Axios.post(`http://localhost:5000/api/weekly/create/${this.props.year}/${this.props.week}`, undefined, this.getAuthHeader()) // Create weekly details for user if it does not have one
			this.getProductToAdd() // fetch inventory
			this.getItemsSold() // fetch list of items added
		})
	}

	getAuthHeader = () => { return {headers: { authorization: `Bearer ${this.state.user.token}`}} }

	toggleAddModal = () => {
		if (!this.state.addModal) {
			this.filterAddProductList("")
		}
		this.setState({addModal: !this.state.addModal})
	}
	toggleEditModal = () => this.setState({editModal: !this.state.editModal})
	toggleDeleteModal = () => this.setState({deleteModal: !this.state.deleteModal})

	updateQuantity = (event, item) => {
		//console.log(event.type) //onChange = change, onBlur = blur
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
		Axios.put(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/items_sold`, this.state.item, this.getAuthHeader()).then(() => {
			this.getItemsSold()
		})
	}

	addItemQuantity = () => {
		let isDuplicate = false
		this.state.listOfItemsAdded.map((item) => {
			if (item._id === this.state.item._id) {
				isDuplicate = true
			}
		})

		isDuplicate ? this.editItemQuantity() :
			Axios.post(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/items_sold`, this.state.item, this.getAuthHeader()).then(() => {
				this.getItemsSold()
			})
	}

	getItemsSold = () => {
		Axios.get(`http://localhost:5000/api/weekly/${this.props.year}/${this.props.week}/items_sold`, this.getAuthHeader()).then((response) => {
			this.setState({listOfItemsAdded: response.data})
		});
	}

	getProductToAdd = () => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader(this.state.user)).then((response) => {
			this.setState({ listOfItems: response.data })
		});
	}

	deleteItem = (itemID) => {
		Axios.delete(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/items_sold/${itemID}`, this.getAuthHeader()).then((response) => {
			this.getItemsSold()
		})
	}

	filterAddProductList = (value) => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader()).then((response) => {
			this.setState({listOfItems: response.data.filter(item => item.name.includes(value))})
		});
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

		return (
			<div>
				<Button className="mb-3" onClick={this.toggleAddModal}>
				Add a product
				</Button>
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
							{this.state.listOfItemsAdded.map(item => {
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
						<Modal.Title>Add a product</Modal.Title>
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
			</div>
		
		)
	}
}