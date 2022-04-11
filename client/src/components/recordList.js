import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SurveyList(props) {
  const navigate = useNavigate();
  const Survey = (props) => (
    <tr>
      <td>{props.record.questiontext}</td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_1`} onChange={handleChange} required></input></td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_2`} onChange={handleChange} required></input></td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_3`} onChange={handleChange} required></input></td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_4`} onChange={handleChange} required></input></td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_5`} onChange={handleChange} required></input></td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_6`} onChange={handleChange} required></input></td>
      <td><input type="radio" name={props.record.varname} id={`${props.record.varname}_7`} onChange={handleChange} required></input></td>
    </tr>
  )


  const [records, setRecords] = useState([]);
  const startdatetime = new Date();

  // This method fetches the questions from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/survey/`);

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, []);

  // This method will delete a question record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the question records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Survey
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This method will handle the submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    records["creationdatetime"] = new Date();
    records["submissiontime"] = records["creationdatetime"].getTime() - startdatetime.getTime();
    const newSurvey = { ...records };
    fetch("http://localhost:5000/survey/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSurvey),
    })
      .catch(error => {
        window.alert(error);
        return;
      });
    navigate("/download");
  }

  const dwnldfn = (e) => {
    console.log("Download Triggered")
    e.preventDefault();
    fetch(`http://localhost:5000/survey/dwnldres/`);
  }

  // This method will handle the radiobutton change
  const handleChange = (e) => {
    var selectedradio = e.target.id;
    for (var ele in records) {
      if (records[ele]["varname"] === selectedradio.slice(0, -2))
        records[ele]["selectedoption"] = selectedradio.slice(-1);
    }
  }

  // This following section will display the table with the records of individuals.
  return (
    <div  style={{ textAlign:"center" ,verticalAlign:"middle" }}>
      <div style={{ height:"100%" , width: "20%", float:"left"}}>
        <img src="https://www.yourmorals.org/images/newGoal.png" alt="Your Morals" width="75%" height="100%" padding-left="200px"></img>
      </div>
      <div style={{ height:"100%" , width: "80%", float:"right",paddingLeft:"-1000px",position: "relative",left: "-50px"}} >
        <h3 >Morality Questions</h3>
        <h5 style={{ paddingTop:"50px"}}>Please fill out the survey below. It would take approximately 10-15 minutes the complete the survey.</h5>
      </div>
      <form onSubmit={handleSubmit} style={{ alignItems: 'center'}}>
        <table className="table table-striped" style={{ marginTop: 0, textAlign:"center" }}>
          <thead>
            <tr>
              <th></th>
              <th>Strongly Disagree</th>
              <th>Disagree</th>
              <th>Slightly Disagree</th>
              <th>Neutral</th>
              <th>Slightly Agree</th>
              <th>Agree</th>
              <th>Strongly Agree</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <input type="submit" value="Submit" className="btn btn-primary" style={{ textAlign: 'center', width:"10%" }} />
        </div>
      </form>
      <hr />
      <button className="btn btn-primary" onClick={dwnldfn} style={{ textAlign: 'center', width:"15%" }}> Download CSV Reports</button>
      <hr />
      <footer style={{ paddingTop: "100px", paddingLeft:"10px",height:"120%"}}>
        <div style={{ height:"100%" , width: "50%" ,float:"left"}}>
          <h5><i>Disclaimer: Recorded survey responses used for resarch studies and not meant for other purposes.</i></h5>
          <h3><i>MyMorals.Org</i></h3>
        </div>
        <div style={{ height:"100%" , width: "50%", float:"right"}}>
          <h3>Designed By</h3>
          <p>Rajat Kumar Singh</p>

          <a class="footera" href="mailto:rajatsin@usc.edu">rajatsin@usc.edu</a>
          <div>
            <a class="footera" href="tel:213-425-7121">213-425-7121</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
