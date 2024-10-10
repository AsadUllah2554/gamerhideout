import './TrendCard.css'
import axios from 'axios'
import { useState, useEffect } from 'react';

import {TrendData} from '../../Data/TrendData.js'
const TrendCard = () => {
  const [notifcations, setNotifcations] = useState([]);
  console.log('notifcations:', notifcations);

  // useEffect(() => {
  //   // Axios GET request
  //   axios.get(`http://localhost:5000/api/notifications`)
  //     .then(response => {
  //       // Update state with fetched posts
      
  //       setNotifcations(response.data.data);
  //       console.log('notifcations from left side:', response.data.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching posts:', error);
  //     });
  // }, []); 
  return (
    <div className="TrendCard">
            <h3>Latest Notifications</h3>
            {TrendData.map((notifcation)=>{
                return(
                    <div className="trend">
                        <span>{notifcation.name}</span>
                        {/* <span>{trend.shares}k shares</span> */}
                        <span>{notifcation.description}</span>
                    </div>
                )
            })}

    </div>
  )
}

export default TrendCard