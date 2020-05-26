const express =require('express');
const mongoose =require('mongoose');
const path = require('path');
const config = require('config'); 

const app = express();

app.use(express.json());

// const db =require('./config/keys').mongoURI;

// mongoose
// .connect(db)
// .then(()=>console.log('mongodb connected...'))
// .catch(err =>console.log(err));
//const mongoURI ='mongodb+srv://tubai:tubai1996@cluster0-zti5r.mongodb.net/test?retryWrites=true&w=majority';
const mongoURI=config.get('mongoURI');
mongoose.connect(mongoURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
mongoose.connection.on('connected',()=>{
    console.log('mongoDB is connected');
});
//use routes
app.use('/api/items',require('./routes/api/items'));
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));

//serve static assets if in production
if(process.env.NODE_ENV ==='production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

const port = process.env.PORT || 5000;


app.listen(port, ()=>console.log(`server started on ${port}`));