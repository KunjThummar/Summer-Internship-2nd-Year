const express  = require('express')
const app = express();
const {connectToDatabase} = require('./connectToDatabase')

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended : true}));

const PORT = 8000;
app.listen(PORT , ()=>{
    console.log(`Server is ruing on port ${PORT}`);
})
connectToDatabase();
