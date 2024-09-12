import express, { json } from "express";
import admin from "firebase-admin";

import serviceAccount from "./config/React-App-Firebase-B055.json" with
{
    type: "json"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 3001;

app.listen(port, ()=>{
    console.log(`Web application listening on port ${port}.`)
});

function addbook(){
  const bookRef = db.collection('Books').doc();
  const docRef = db.collection('Books').doc(bookRef.id);
  docRef.set(
    {
      id: 'B1004',
      title: 'Title B1004',
      description: 'Desc B1004',
      category: '20',
      author: 'Author B1004',
      price: '219',
      publisher: 'Pub B1004',
      stock: false
    }
  );
  console.log('Book added.');
}

app.get('/addBook', (req , res) =>{
  addbook();
  res.end('Added new book.');
})

async function fetchbook(){
  const result = [];
  const booksRef = db.collection('Books');
  const docRef = await booksRef.get();
  docRef.forEach(doc => {
    result.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return JSON.stringify(result);
}

app.get('/getBooks', (req , res) =>{
    res.set('Content-type','application/json');
      fetchbook().then((jsondata) =>{
        res.send(jsondata);
    }).catch((error) => {
        res.send(error);
    });
});

