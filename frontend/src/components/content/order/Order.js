import React from 'react'
import { useEffect } from 'react'
import Axios from 'axios'
import { Tabs, Tab, Dropdown, DropdownButton, Button, Modal, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ItemsSold from './ItemsSold';
import OrderReceived from './OrderReceived';
import NextOrder from './NextOrder';
import moment from 'moment'

function Order() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  },[user, navigate])

  return (
    <div>
      <OrderClass user={user}/>
    </div>
  )
}

class OrderClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
      week: -1,
      year: -1,
      orderSpans: [
        {
          week: -1,
          year: -1,
          string: "",
        }
      ],
      warningModal: false
    }
  }
  
  componentDidMount = () => {
    var date = new Date();
    const week = this.getCurrentWeek()
    const year = date.getFullYear()
    
    this.setState({week: week, year: year})
    this.getOrderSpans()

    // Create weekly details for user if it does not have one
    if (this.state.user && this.state.user.email !== "demo@demo.com") {
      console.log("Creating new weekly details for " + this.state.user.name + "...")
      Axios.post(`/api/weekly/create/${year}/${week}`, undefined, this.getAuthHeader())
    }
  }
  
  componentDidUpdate = () => {
  }

  getCurrentWeek = () => {
    var currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    return result
  }

  getAuthHeader = () => { return {headers: { authorization: `Bearer ${this.state.user && this.state.user.token}`}} }

  getOrderSpans = () => {
		Axios.get(`/api/weekly/order_spans`, this.getAuthHeader()).then((response) => {
      const newOrderSpans = []
      response.data.map((weekYear) => {
        let monday = moment().year(weekYear.year).week(weekYear.week).day("Monday")
        let sunday = moment().year(weekYear.year).week(weekYear.week+1).day("Sunday")

        let str = `(${monday.month()+1}.${monday.date()} ~ ${sunday.date()})`
        newOrderSpans.push({
          week: weekYear.week,
          year: weekYear.year,
          string: `Order Details for ${weekYear.week}th week of ${weekYear.year}${str}`
        })
      })
      this.setState({...this.state.orderSpans, orderSpans: newOrderSpans})
		});
  }

  setWeekAndYear = (week, year) => {
    this.setState({...this.state.orderSpans, week: week, year: year})
  }

  finalizeWeek = async () => {
    //read quantity of each items from itemsSold, orderReceived, orderForNextWeek
    //new inventory quantity = inventory - itemsSold + ordersReceived + ordersForNextWeek
    //set inventory quantity for each items
    const weeklyData = await Axios.get(`/api/weekly/get_all_datas/${this.state.week}/${this.state.year}`, 
      this.getAuthHeader()).then((response) => {return response.data[0]})
    const inventory = await Axios.get("/api/inventory", this.getAuthHeader())
      .then((response) => {return response.data})
    const itemsSold = weeklyData.itemsSold
    const orderReceived = weeklyData.orderReceived
    const nextOrder = weeklyData.orderForNextWeek
    const newInventory = []

    if (weeklyData.isFinalized) {
      alert("This week has been already finalized.")
    } else {
      inventory.map((item) => {
        let quantityIS = this.findQuantityWithID(itemsSold, item._id)
        let quantityOR = this.findQuantityWithID(orderReceived, item._id)
        let quantityNO = this.findQuantityWithID(nextOrder, item._id)

        let newQuantity = item.quantity - quantityIS + quantityOR + quantityNO
        item.quantity = newQuantity < 0 ? 0 : newQuantity
        //console.log("Name: " + item.name + ", IS:" + quantityIS + ", OR:" + quantityOR + ", NO:" + quantityNO )
        newInventory.push(item)
      })
      Axios.put("/api/inventory/all", newInventory, this.getAuthHeader())
      Axios.put(`/api/weekly/${this.state.year}/${this.state.week}/finalized`, null, this.getAuthHeader())  
    }
  }

  findQuantityWithID = (items, id) => {
    for (var i=0; i<items.length; i++) {
      if (items[i]._id == id) {
        return items[i].quantity
      }
    }
    return 0
  }

  toggleWarningModal = () => { this.setState({warningModal: !this.state.warningModal}) }

  toastForDemo = () => {
    return (
      <Toast className="m-3 glow-effect-msg">
        <Toast.Header closeButton={false}>
          <a href="https://github.com/dun1007/Stockify-Inventory-Manager" rel="noreferrer" target="_blank">
            <strong className="me-auto">Message from Steve</strong>
          </a>
          <small className="ms-auto">Just now</small>
        </Toast.Header>
        <Toast.Body>
          <strong>How's your journey so far? </strong><br />I will walk you through on how to finish order in Just 
          few clicks. You are on week {this.state.week} of {this.state.year}, and I filled <strong>[Items Sold]</strong> for you in advance. 
          Go ahead and click <strong>[Order Received]</strong> below for next step.
        </Toast.Body>
      </Toast>
    )
  }

  render() {
    return (
      <div>
        {((this.state.user && this.state.user.name) === "Demo Account") ? this.toastForDemo() : <p />}
        <DropdownButton id="dropdown-basic-button" title="Choose the week to manage" className="m-3">
          {this.state.orderSpans.map((span) => {
            return <Dropdown.Item as="button" key={`span-${span.year}-${span.week}`} onClick={(e)=>{
              this.setWeekAndYear(span.week, span.year)
            }}>{span.string}</Dropdown.Item>
          })
          }
        </DropdownButton>

        <Tabs className="m-3">
          <Tab eventKey="home" title="Items Sold">
            <ItemsSold user={this.state.user} week={this.state.week} year={this.state.year} />
          </Tab>
          <Tab eventKey="profile" title="Orders Received">
            <OrderReceived user={this.state.user} week={this.state.week} year={this.state.year} />
          </Tab>
          <Tab eventKey="contact" title="Next Order">
            <NextOrder user={this.state.user} week={this.state.week} year={this.state.year} />
          </Tab>
        </Tabs>

				<Button className="mt-5 ms-3 mb-5 btn-lg btn-success" onClick={this.toggleWarningModal}>
					Finalize Order for This Week
				</Button>
        
        <Modal show={this.state.warningModal} onHide={this.toggleWarningModal}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>You are trying to update inventory with weekly details for this week. This cannot be undone.</p>
            <h3 className="text-center">Are you sure?</h3>
          </Modal.Body>
            
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleWarningModal}>Just a sec...</Button>
            <Button variant="success" onClick={() => {
              this.toggleWarningModal()
              this.finalizeWeek()
            }}>Yes, 100%</Button>
          </Modal.Footer>
        </Modal>
      </div>

    )
  }
}

export default Order



