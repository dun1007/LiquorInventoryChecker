import React from 'react'
import { Accordion } from "react-bootstrap";
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Axios from 'axios'

function UserGuide() {
  // If user is demo, create sample database for them
  const {user} = useSelector((state) => state.auth)

  useEffect(() => {
    if (user && user.email === "demo@demo.com" && user.name === "Demo Account" 
      && sessionStorage.getItem('demoDataGenerated') === 'false') {
      sessionStorage.setItem('demoDataGenerated', 'true')
      populateInventoryForDemoAcc()
    } else {
    }
  }, [user]);

  const populateWeeklyOrderForDemoAcc = async (inventory) => {
    const weeklyDetails = {
      user: user._id,
      year: 0,
      week: 0,  //get year and week
      isFinalized: false,
      itemsSold: [],
      orderReceived: [],
      orderForNextWeek: [],
    }
    inventory.map((item) => {
      
      if (Math.random() > 0.5) {
        const originalQuantity = item.quantity
        item.quantity = Math.round(randomIntFromInterval(0, originalQuantity/2))
        weeklyDetails.itemsSold.push(item)
      }

      if (Math.random() > 0.5) {
        const originalQuantity = item.quantity
        item.quantity = Math.round(randomIntFromInterval(0, originalQuantity/2))
        weeklyDetails.orderReceived.push(item)
      }

      if (Math.random() > 0.5) {
        const originalQuantity = item.quantity
        item.quantity = Math.round(randomIntFromInterval(0, originalQuantity/2))
        weeklyDetails.orderForNextWeek.push(item)
      }
    })
    console.log(weeklyDetails)

  }


  const randomIntFromInterval = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const populateInventoryForDemoAcc = async () => {
    const inventory = addRandomItem()
    await Axios.put(`http://localhost:5000/api/inventory/all`, inventory, getAuthHeader()).then((response) => {
      populateWeeklyOrderForDemoAcc(response.data)
    })
  } 

  const getAuthHeader = () => { return {headers: { authorization: `Bearer ${user.token}`}} }

  const addRandomItem = () => {
    const randomName = ["Budweiser", "Bud Light", "Busch", "Coors", "Kokanee", "Coors Light", "Guiness",
    "Captain Morgan", "Bacardi", "Smirnoff", "Absolut", "Kahlua", "Carolans",
    "Monte Creek", "Fat Bastard", "Dom Perignon", "Moon Curser",
    "Whiteclaw", "Mike's", "Growers", "Nude", "Strongbow"]
    const randomNameAffix = [" x6", " x8", " x15", " x24", " Single", " NonAlc."]
    const randomType = ["Beer", "Wine", "Cider", "Liquor"]
    const randomVolume = [200, 473, 500, 571, 750, 1.14]
    const randomUnit = [1, 4, 6, 8, 12, 15, 24]
    const randomPackaging = ["Bottle", "Can"]
    const randomPrice = [3.2, 7.25, 11.2, 14.3, 25.2, 30, 34.1, 47.3]
    const randomQuantity = [5, 6, 7, 8, 9, 10, 12, 14, 15, 17, 22, 24]
    const newInventory = []
    for(var i=0; i<20; i++) {
      const randomItem = {
        name: randomName[Math.floor(Math.random()*randomName.length)] + randomNameAffix[Math.floor(Math.random()*randomNameAffix.length)],
        type: randomType[Math.floor(Math.random()*randomType.length)],
        volume: randomVolume[Math.floor(Math.random()*randomVolume.length)],
        unit: randomUnit[Math.floor(Math.random()*randomUnit.length)],
        packaging: randomPackaging[Math.floor(Math.random()*randomPackaging.length)],
        price: randomPrice[Math.floor(Math.random()*randomPrice.length)],
        quantity: randomQuantity[Math.floor(Math.random()*randomQuantity.length)],
      }
      newInventory.push(randomItem)
    }
    return newInventory
  }

  return (
    <Accordion >
      <Accordion.Item eventKey="0">
        <Accordion.Header><strong><h3>What is Stockify?</h3></strong></Accordion.Header>
        <Accordion.Body className="accordion-body">
          Stockify is a web alcohol inventory management software, <strong>built by small business owner, for small business owners.</strong> It 
          allows you to manage your inventory with ease by automating a lot of daunting tasks usually expected by traditional management. For example,
          you can keep track of your sales by month and item type, auto-fill weekly flow of goods, and even suggest you the next order based on your past
          record. <br /><br />If you are interested, please register your account and keep reading.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><strong><h3>Getting started</h3></strong></Accordion.Header>
        <Accordion.Body className="accordion-body">
          First, the software needs something to start off of. Browse to [Inventory] and start adding your initial inventory items. Don't worry, you only need to do it 
          once at first, and your life will be a whole lot easier afterwards. <br /><br /> 
          When you are finished, go to [Manage Order].
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header><strong><h3>Manage your inventory the smart way</h3></strong></Accordion.Header>
        <Accordion.Body className="accordion-body">
          Stockify keeps track of your weekly orders and suggests you the next order amount 
          based on 3 factors: <strong>your current stock, the amount sold, and the amount received.</strong><br /><br />
          Populate [Items Sold] with your sales data for this week. Then in [Orders Received], you can either 
          manually input your delivery, or import last week's order directly. Click on [Autofill with last week's order] button
          to do this in one click. Note that this feature requires the data from last week.<br /><br />
          When you are done, Stockify is ready to auto-generate the next order for you. Go to [Next Order], and click on [Suggest and Order].
          It will auto-populate your next order table, and all you need to do is either capture screenshot and E-mail, or export it to a form
          exclusive to vendor.<br /><br /> 
          Future versions will support many advanced features such as seasonal suggestion and machine-learning suggestion. 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header><h3>Review your records</h3></Accordion.Header>
        <Accordion.Body className="accordion-body">
          Gone are the days when your tax accountant asks for monthly revenue and you dig through mountain of papers to figure it out. Go to [Sales] and 
          it will show you your monthly revenue visualized to capture the landscape of your business in one view.<br /><br />
          Future versions will support more in-depth analysis. By season, by outlets, and so on.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header><h3>Contribute</h3></Accordion.Header>
        <Accordion.Body className="accordion-body">
          If you are tech savvy person who noticed a glitch, kindly leave an issue or create a pull request on GitHub.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default UserGuide