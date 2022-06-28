# Survey Feedback 

Website built on React, Node.js, MongoDB with survey questionaire capabitity.

<ul>
<li>The codebase is split into server and client folder. Client folder houses the React based code for the UI and the server contains backend functionality.
<li>At first execution, the questions are extracted from csv file and a MongoDB database collection ‘questions’ from where we can do subsequent query. We only choose a subset of
the overall questions randomly.<br><br>
<div align="center">
<img src="https://i.imgur.com/zVuGj1t.png" width=600px>
<p align="left">Upon successful submission the following page is displayed to the user.</p>
<img src="https://i.imgur.com/kTfJQlh.png" width=600px>
</div>
<li>All back end calls are Restful in nature. Submit button will trigger a post call and responses are recorded in the MongoDB collection ‘responses’.
<div align="center">
<img src="https://i.imgur.com/KTu8vn7.png" width=600px>
<p align="left">Responses are stored using just the basic keys and information</p>
<img src="https://i.imgur.com/Drd4uJq.png" width=600px>
<p align="left">Expanding the Node Collection we get:-</p>
<img src="https://i.imgur.com/cN5pSvW.png" width=600px>
</div>
<li> Download CSV Reports button is given on the landing page for the lack of a better place. This is the format of the stored results.
<div align="center">
<img src="https://i.imgur.com/bp3Lvhv.png" width=800px>
</div>
The Survey responses are flattened and then converted to csv. Each survey question response field is prefixed with the question number in the survey. We have also recorded time for submission and create datetime.  Question response can be obtained from the selectedoption field where 1= Strongly Disagree, 2=Disagree, … and so on. 
</ul>
