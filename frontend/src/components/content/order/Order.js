import React from 'react'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { Tabs, Tab, Dropdown, DropdownButton} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ItemsSold from './ItemsSold';
import OrderReceived from './OrderReceived';
import NextOrder from './NextOrder';
import { previousMonday, nextSunday, getMonth, getDate } from 'date-fns'

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
      weekString: "",
      orderSpans: [
        {
          week: -1,
          year: -1,
          string: "",
        }
      ]
    }
  }
  
  componentDidMount = () => {
    var date = new Date();

    const monday = previousMonday(date)
    const sunday = nextSunday(date)
    const week = this.getCurrentWeek()
    const year = date.getFullYear()
    
    const weekString = `Order Details for ${week}th week of ${year} (${getMonth(monday)+1}.${getDate(monday)} ~ ${getMonth(sunday)+1}.${getDate(sunday)})`
    this.setState({weekString: weekString, week: week, year: year})
    //this.setState(this.getOrderSpans()) I WILL GET BACK TO IT LATER
  }

  getCurrentWeek = () => {
    var currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    return result
  }

  getAuthHeader = () => { return {headers: { authorization: `Bearer ${this.state.user.token}`}} }

  getOrderSpans = () => {
		Axios.get(`http://localhost:5000/api/weekly/order_spans`, this.getAuthHeader()).then((response) => {
      const data = response.data
      var date = new Date();
      const monday = previousMonday(date)
      const sunday = nextSunday(date)
      const week = this.getCurrentWeek()
      const year = date.getFullYear()

      this.setState({
        orderSpans: {...response.data, string:
          `Order Details for ${data.week}th week of ${data.year} (${getMonth(monday)+1}.${getDate(monday)} ~ ${getMonth(sunday)+1}.${getDate(sunday)})`}
      })
		});
  }

  render() {
    return (
      <div>
        <DropdownButton id="dropdown-basic-button" title={this.state.weekString}>
          {this.state.orderSpans.map((span) => {
            return <Dropdown.Item as="button" key={`span-${span.year}-${span.week}`}>{span.week} + {span.year} </Dropdown.Item>
          })
          }
        </DropdownButton>
        <Tabs className="mb-3">
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
      </div>
    )
  }
}

export default Order



