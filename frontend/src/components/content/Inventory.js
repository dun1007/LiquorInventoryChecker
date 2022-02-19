import React from 'react'
import { useState, useEffect } from 'react'
import Axios from 'axios'


function Inventory() {

  const [listOfAlcohols, addAlcohol] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [volume, setVolume] = useState(0);
  const [unit, setUnit] = useState(0);

  useEffect(() => {
    Axios.get("http://localhost:3001/getAlcohols").then((response) => {
      addAlcohol(response.data);
    });
  }, []);

  const addItem = () => {
    Axios.post("http://localhost:3001/addAlcohol", {
        name: name,
        type: type,
        volume: volume,
        unit: unit,
      }).then((response) => {
        addAlcohol([
          ...listOfAlcohols, 
          {
            name: name,
            type: type,
            volume: volume,
            unit: unit,
          }
        ]);
      //alert("Added an item");
    });
  }

  return (
    <div>
      <div className="inventoryDisplay">
        {listOfAlcohols.map(alcohol => {
          return (
            <div>
              <p>Name: {alcohol.name}</p>
              <p>Type: {alcohol.type}</p>
              <p>Volume: {alcohol.volume}mL</p>
              <p>Unit: x{alcohol.unit}</p>
            </div>
          );
        })}
      </div>
        <input 
          type="text" 
          placeholder="Name..." 
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input 
          type="text" 
          placeholder="Type..."           
          onChange={(event) => {
            setType(event.target.value);
          }}
        />
        <input 
          type="number" 
          placeholder="Volume..." 
          onChange={(event) => {
            setVolume(event.target.value);
          }}
        />
        <input 
          type="number" 
          placeholder="Unit..." 
          onChange={(event) => {
            setUnit(event.target.value);
          }}
        />
        <button onClick={addItem}>Add Alcohol</button>
      <div>
      </div>
    </div>
  )
}

export default Inventory