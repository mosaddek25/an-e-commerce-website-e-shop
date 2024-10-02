require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');

global.__basedir = __dirname;

mongoose.connect('mongodb://localhost:27017/Rupak_Database',{
    poolSize: 10,
    connectTimeoutMS: 30000,
    useNewUrlParser: true, 
})
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error(err));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`App running on port ${port}!`);
})
