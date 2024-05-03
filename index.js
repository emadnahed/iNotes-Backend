const connectToMongo = require("./db");
connectToMongo();

const express = require("express");
const app = express();

// Cors middleware added
var cors = require( "cors" );
app.use(cors());  


// Port changed to avoid common ports
const port = 5000;

app.use(express.json())

// Below is the auth route created.
app.use("/api/auth", require("./routes/Auth"));

app.use("/api/notes", require("./routes/notes"));

// Endpoint to catch no existing or undeclared endpoints
app.use((req, res) => {
  res.status(404).send('API endpoint locale error');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
