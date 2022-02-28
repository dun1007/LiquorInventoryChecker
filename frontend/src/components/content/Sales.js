import React, { useEffect, useState } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Axios from 'axios'
import moment from 'moment'
import { Tabs, Tab, Dropdown, DropdownButton} from 'react-bootstrap';


// read week spans 
// name: weekcount, data: total revenue(map itemSold) 
function Sales() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)
  const [chartData, setChartData] = useState([]) 
  const [weekSpans, setWeekSpans] = useState([{week: -1, year: -1, string: ""}])
  const [thisWeek, setThisWeek] = useState(0)
  const [thisYear, setThisYear] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    // Fetch week spans
    Axios.get(`http://localhost:5000/api/weekly/order_spans`, getAuthHeader()).then((response) => {
      const newWeekSpans = []
      response.data.map((weekYear) => {
        let monday = moment().year(weekYear.year).week(weekYear.week).day("Monday")
        let sunday = moment().year(weekYear.year).week(weekYear.week+1).day("Sunday")
        let str = `(${monday.month()+1}.${monday.date()} ~ ${sunday.date()})`

        newWeekSpans.push({
          week: weekYear.week,
          year: weekYear.year,
          string: `${weekYear.week}th week of ${weekYear.year}${str}`
        })
      })
      setWeekSpans(newWeekSpans)
		})
    // Set current week and year
    const date = new Date()
    const year = date.getFullYear()
    const week = getCurrentWeek()
    setThisWeek(week)
    setThisYear(year)
    getSalesForWeekSpan(year, week)
    getSalesForEntirePeriod()

  },[user, navigate])

  const setWeekAndYear = (week, year) => { setThisWeek(week); setThisYear(year) }
  const getAuthHeader = () => { return {headers: { authorization: `Bearer ${user && user.token}`}} }

  const getSalesForWeekSpan = (year, week) => { 
    Axios.get(`http://localhost:5000/api/weekly/${year}/${week}/items_sold`, getAuthHeader()).then((response) => {
      //this is week limited
		});
  }
  const getSalesForEntirePeriod = () => {
    Axios.get(`http://localhost:5000/api/weekly/get_all_datas`, getAuthHeader()).then((response) => {
      const data = []
      response.data.map((weeklyData) => {
        const chartProps = {
          name: `${weeklyData.week}W${weeklyData.year}`,
          Revenue: getSum(weeklyData.itemsSold, ""),
          Beer: getSum(weeklyData.itemsSold, "Beer"),
          Wine: getSum(weeklyData.itemsSold, "Wine"),
          Cider: getSum(weeklyData.itemsSold, "Cider"),
          Liquor: getSum(weeklyData.itemsSold, "Liquor")
        }
        data.push(chartProps)
      })
      setChartData(data)
		});
  }

  const getSum = (data, type) => {
    if (type === "") {
      return Math.round(data.reduce((sum, curr) => sum + curr.quantity*curr.price, 0))
    } else {
      return Math.round(data.filter((item) => item.type === type)
        .reduce((sum, curr) => sum + curr.quantity*curr.price, 0))
    }
  }
  

  const getCurrentWeek = () => {
    var currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    return result
  }

  return (
    <div>

      {((user && user.name) === "Demo Account") ? <p>I see you are on demo mode. Here you can view your monthly revenue 
        chart.
      </p> : <p />}
      <h1 className="text-center">Revenue Chart for {user && user.name}</h1>
      <ResponsiveContainer width={"99%"} height={300}>
        <LineChart width={730} height={250} data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Revenue" stroke="#17202A" />
          <Line type="monotone" dataKey="Beer" stroke="#F5B041" />
          <Line type="monotone" dataKey="Wine" stroke="#E74C3C" />
          <Line type="monotone" dataKey="Cider" stroke="#05FE26" />
          <Line type="monotone" dataKey="Liquor" stroke="#EB05FE" />
        </LineChart>
      </ResponsiveContainer>

      {/*<DropdownButton id="dropdown-basic-button" title="Choose to display weekly details">
        {weekSpans.map((span) => {
          return <Dropdown.Item as="button" key={`span-${span.year}-${span.week}`} onClick={(e)=>{
            setWeekAndYear(span.week, span.year);
          }}>{span.string}</Dropdown.Item>
        })
        }
      </DropdownButton>*/}
    </div>
  )
}

export default Sales