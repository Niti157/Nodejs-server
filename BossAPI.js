import express, { json } from "express";
import admin from "firebase-admin";
import cors from 'cors';
import bodyParser from "body-parser";
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

app.use(bodyParser.json());
app.use(cors());

app.listen(port, ()=>{
    console.log(`Web application listening on port ${port}.`)
});

function addBook() {
  const bookRef = db.collection('Books').doc();
  const docRef = db.collection('Books').doc

  (bookRef.id);
  docRef.set(
     {
      bookCode : bookRef.id,
      id : "B1004",
      title : "Title B1004"
     }
  );
  console.log('Book added.');
}
app.get('/addBook', (req, res) => {
  addBook();
  res.end('Added new book.');
})

async function addBookNew(tmpBookData) {
  const bookRef = db.collection('Books').doc();
  const docRef = db.collection('Books').doc(bookRef.id);

  let myData = {
    bookCode : bookRef.id,
    bookTitle : tmpBookData.bookTitle,
    bookDesc : tmpBookData.bookDesc,
    bookCate : tmpBookData.bookCate,
    bookAuthor : tmpBookData.bookAuthor,
    bookStock : tmpBookData.bookStock
   };
   
  await docRef.set(myData);
  console.log('Book added.');
}

app.post('/api/addBook', (req, res) => {
  const { bookTitle, bookDesc, bookCate, bookAuthor, bookStock } = req.body
  const tmpData = { bookTitle, bookDesc, bookCate, bookAuthor, bookStock } 
  addBookNew(tmpData);
  res.status(200).json({ message: 'การบันทึกข้อมูลสำเร็จ'});
})

async function deleteBook(bookCode) {
  const docRef = db.collection('Books')
                 //.where("booCode", "==", bookCode);
                 .doc(bookCode);
  await docRef.delete();
  console.log('Book deleted.');
}

app.delete('/api/deleteBook/:bookCode', (req,res) => {
     const { bookCode } = req.params;
     deleteBook(bookCode);
     res.status(200).json({message: '[INFO ลบข้อมูลสำเร็จ]'})
    });


async function fetchBook() {
  const result = [];
  const booksRef = db.collection('Books');
  const docRef = await booksRef.get();
  docRef.forEach(doc => {
    result.push({
      id : doc.id,
      ...doc.data()
    });
  });
  return JSON.stringify(result);
}

app.get ('/api/getBooks', (req,res) => {
  res.set('content-type', 'application/json');
  fetchBook().then((jsondata) => {
      res.send(jsondata);
  }).catch((error) => {
      res.send(error);
  });
});

async function fetchBookById(bookId) {
  const result = [];
  const booksRef = db.collection('Books').where('bookCode','==', bookId);
  const docRef = await booksRef.get();
  docRef.forEach(doc => {
    result.push({
      id : doc.id,
      ...doc.data()
    });
  });
  return result;
}

// http://localhost:3001/api/getBookById
app.get('/api/getBookById/:bookId', (req , res) => {
    const { bookId } = req.params;
    res.set('content-type', 'application/json');
  fetchBookById(bookId).then((jsondata) => {
      res.send(jsondata[0]);
  }).catch((error) => {
      res.send(error);
  });

  async function updateBook(bookId, bookData) {
    const docRef = db.collection('Books').doc(bookId);
    await docRef.update(bookData);
    console.log('Book updated');
  }

  // http://localhost:3001/api/updateBook
  app.post('/api/updateBook', (req , res) => {
    const { bookId, bookTitle, bookDesc, bookCate } = req.body;
    updateBook(bookId,{ bookTitle, bookDesc, bookCate });
    res.status(200).json({ message: '[INFO] Book Updated'})
  })
})