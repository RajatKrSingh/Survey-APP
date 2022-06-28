# Survey Feedback 

Website built on React, Node.js, MongoDB with survey questionaire capabitity.

<ul>
<li>The codebase is split into server and client folder. Client folder houses the React based code for the UI and the server contains backend functionality.
<li>At first execution, the questions are extracted from csv file and a MongoDB database collection ‘questions’ from where we can do subsequent query. We only choose a subset of
the overall questions randomly.<br><br>
<div align="center">
<img src="https://i.imgur.com/zVuGj1t.png" width=600px>
<p>Upon successful submission the following page is displayed to the user.</p>
<img src="https://i.imgur.com/kTfJQlh.png" width=600px>
</div>
<li>All back end calls are Restful in nature. Submit button will trigger a post call and responses are recorded in the MongoDB collection ‘responses’.


</ul>
