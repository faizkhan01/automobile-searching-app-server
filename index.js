const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const fileUpload = require("express-fileupload");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smtok.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();
app.use(express());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("services"));
const port = 5000;


// Root url api
app.get("/", (req, res) => {
    res.send("Welcome to Automobile Searching App Server");
});
  
  
client.connect((err) => {
  
    // Automobile Collections....
    const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  
  
  
    // Add Automobiles..... 
    app.post("/addProduct", (req, res) => {
  
      const file = req.files.image;
      const allData = JSON.parse(req.body.data);
      const newImg = file.data;
      const encodedImg = newImg.toString("base64");
  
      const image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encodedImg, "base64"),
      };
  
      allData.image = image;
      productsCollection.insertOne(allData)
      .then((result) => {
        res.send(result.ops[0]);
      });
  
    
    });
  
  
    //Get All Automobiles......
    app.get("/products", (req, res) => {
  
        productsCollection.find({})
        .toArray((error, documents) => {
    
          res.send(documents);
        });
    
    });



    //Update Automobiles.......
    app.patch("/updateProductById/:id", (req, res) => {
      
      const file = req.files.image;
      const allData = JSON.parse(req.body.data);
      const newImg = file.data;
      const encodedImg = newImg.toString("base64");
  
      const image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encodedImg, "base64"),
      };
      allData.image = image;
      
      
      productsCollection.updateOne({ _id: ObjectId(req.params.id) },
        {
            $set: { name: allData.name, description: allData.description, image: allData.image }
        }
      )
      .then(result => {

          console.log(result);
          res.send(result.modifiedCount > 0);
      });
  
    });




    //Delete Automobiles.....
    app.delete("/deleteProductById", (req, res) => {
      productsCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {

        console.log(result);
        
      })
    })



   //Find Single Automobile.....
    app.get("/singleProductById/:id", (req, res) => {
  
      ordersCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, documents) => {
        
        console.log(documents);
        
      });
  
    });

  
    console.log("Database Connected");
  });
  
  
  
  app.listen(process.env.PORT || port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
  
















