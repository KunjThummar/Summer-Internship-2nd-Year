const express  = require('express')
const app = express();
const {connectToDatabase} = require('./connectToDatabase')
const authRoute =require('./routes/authRoute')
const employeeRoute = require('./routes/employeeRoute')
const adminRoute = require('./routes/adminRoute')
const cors = require('cors')


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended : true}));

app.use(
    '/api/auth',
    authRoute
)

app.use(
    '/api/admin',
    adminRoute
)

app.use(
    '/api/employee',
    employeeRoute
)


const PORT = 8000;
app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})
connectToDatabase();
