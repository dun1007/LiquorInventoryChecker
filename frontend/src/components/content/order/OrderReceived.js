import React, { Component } from 'react'
import { Table, Button, InputGroup, FormControl, Modal, Popover, OverlayTrigger, Form } from 'react-bootstrap';
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
			//this.getItemsSold() // fetch list of items added
		})
	}

  getProductToAdd = () => {
		Axios.get("http://localhost:5000/api/inventory", this.getAuthHeader(this.state.user)).then((response) => {
			this.setState({ listOfItems: response.data })
		});
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
		Axios.put(`http://localhost:5000/api/weekly/${this.state.year}/${this.state.week}/orders_received`, this.state.item, this.getAuthHeader())
      .then(() => {
			//this.getItemsSold()
		})
	}

  render() {
    return (
      <div>OrderReceived</div>
    )
  }
}
