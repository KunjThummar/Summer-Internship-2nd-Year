const express  = require('express')
const app = express();
const {connectToDatabase} = require('./connectToDatabase')
const routes = require('./routes/route')
const cors = require('cors')


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended : true}));

app.use(
    '/api/auth',
    routes
)

const PORT = 8000;
app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})
connectToDatabase();
