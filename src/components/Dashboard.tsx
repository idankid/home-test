import React, { useEffect, useState } from 'react'
import './style.module.css'

type message = {
  from_email :string;
  msg_id : string;
  subject : string
  to_email : string;
  status : string;
  opens_count: number;
  clicks_count:number;
  last_event_time : string;
}

type stats = {
  subject : string;
  uniqueOpens : number;
  emailList : receiver[]
}

type receiver = {
  mail: string;
  lastOpened: string;
}


const Dashboard = ()=> {
  const fakeData : stats[] = [
    {subject : "subject", uniqueOpens:6, emailList:[{mail:"emailA", lastOpened:"date"}, {mail:"emailB", lastOpened:"date"}, {mail:"emailC", lastOpened:"date"}]},
    {subject : "subject2", uniqueOpens:2, emailList:[{mail:"emailC", lastOpened:"date"}, {mail:"emailE", lastOpened:"date"}, {mail:"emailF", lastOpened:"date"}]}
  ]

  const [statistics, setStatistics]= useState(fakeData);
 
  useEffect(()=>{
    getStatistics();
  })

  // getting the statistics
  const getStatistics = ()=>{
    // getting the data with the statistics and parsing it
    fetch("http://localhost:3000/statistics",{method:"GET"}).then(async response=>{

      let data = await response.json();
      mapResponseToStatistics(data["messages"]);

    }).catch(err=>{
      console.log(err);
    })

  }

  const mapResponseToStatistics = (response: message[])=>{
    let tempToSet : {[key: string] : any} = {}

    // creating the data structure need to the dashboard
    response.forEach(item=>{
      if(item.opens_count === 0) return;

      // removing the end of the id which says the id of user the message sent
      let key = item.msg_id.substring(0, item.msg_id.length - 3);

      // incase there was already a email that got the same message 
      if(!tempToSet[key])
        tempToSet[key] = {
            subject: item.subject,
            uniqueOpens: 1,
            emailList : [{mail: item.to_email, lastOpened: item.last_event_time}]
        }
      
      // adding another email to the messages sent
      else{
        tempToSet[key].uniqueOpens += 1;
        tempToSet[key].emailList.push({
          mail: item.to_email,
          lastOpened: item.last_event_time
        })
      }
    })
    
    
    // converting to an array for easiser use in the render
    const toSet :stats[] = [];

    for(let stat in tempToSet){
      toSet.push(tempToSet[stat]);
    }

    setStatistics(toSet);

  }

  return (
    <>
    <button onClick={getStatistics}>click here to reload</button>
        <h1>Email Dashboard</h1>

        {/* the  table that hold the dash board*/}
        <table>

          {/* table header */}
          <thead>
            <tr>
              <td>Email Subject</td>
              <td>unique opens</td>
              <td>List of email addresses</td>
            </tr>
          </thead>

          {/* table body */}
          <tbody>
            {/* mapping the emails to the table */}
            {statistics.map((item, indx)=>{
              return(
                // creating the table row
                <tr key={indx}>
                  <td>{item.subject}</td>
                  <td>{item.uniqueOpens}</td>
                  <td>

                    {/* the list of emails in a select */}
                    <select style={{width:250}}>
                      <option>Email List</option>

                      {/* mapping the email address list */}
                      {item.emailList.map((email, index)=>{
                        return(
                          <option key={index} disabled>
                            mail: {email.mail} - last opened: {email.lastOpened} 
                          </option>
                        )
                      })}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
    </>
  )
}

export default Dashboard