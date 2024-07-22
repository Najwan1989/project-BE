const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'komentar'
});

app.listen(3000, () => {
    console.log("Server Started");
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/submit', (req, res) => {
    const { name, email, comment } = req.body;
    const query = "INSERT INTO data (Nama, Email, Komentar) VALUES (?, ?, ?)";

    db.query(query, [name, email, comment], (err) => {
        if (err) {
            console.log('Error Occurred');
            return res.status(500).json({ error: 'Error occurred while inserting data' });
        }
        console.log('Successful insertion');
        res.json({ message: 'Data received successfully', data: { name, email, comment } });
    });

    console.log('Received data', { name, email, comment });
});

app.get('/komentar', (req, res) => {
    const sql = 'SELECT * FROM data';
    db.query(sql, (err, result) => {
        if (err) {
            console.log('Error occurred:', err);
            return res.status(500).json({ error: 'Error occurred while fetching data' });
        }
        res.json(result);
    });
});

app.delete('/komentar/hapus/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM data WHERE id = ?';

    db.query(sql, id, (err, result) => {
        if (err) {
            console.log('Error occurred:', err);
            return res.status(500).json({ error: 'Error occurred while deleting data' });
        }
        console.log('Deleted successfully:', result.affectedRows);
        res.json({ message: 'Successfully deleted' });
    });
});

app.put('/komentar/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, comment } = req.body;
    console.log(name);
    const sql = 'UPDATE data SET Nama = ?, Email = ?, Komentar = ? WHERE id = ?';

    db.query(sql, [name, email, comment, id], (err, result) => {
        if (err) {
            console.log('Error occurred:', err);
        }
        console.log('Updated successfully:', result.changedRows);
        res.json({ message: 'Successfully updated' });
    });
});
