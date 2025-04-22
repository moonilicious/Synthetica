import React, { useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Make sure your Firebase setup is correctly imported
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import './Educator.css';
import Navbar from './Navbar';
const Educator = () => {
  const [googleSheet, setGoogleSheet] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const onDrop = (acceptedFiles) => {
    setResult(null);
    if (acceptedFiles.length > 0) {
      setGoogleSheet(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.xlsx' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!googleSheet) {
      setError('Please provide both the Google Sheet and the minimum permissible AI percentage.');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      const updatedRows = await Promise.all(rows.map(async (row) => {
        const [timestamp, pid, url] = row;
        try {
          if(url){
            const [_, username, tokenId] = url.split('/').slice(3);
            const tokenData = await fetchTokenData(username, tokenId);
            const accuracy = tokenData?.accuracy;
            const text = tokenData?.text;
            row.push(text, accuracy);
            return row;
          }
        } catch (err) {
          console.error(`Error processing row with URL ${url}:`, err);
          return row;
        }
      }));

      const newSheetData = [headers.concat(['Text', '%AI']), ...updatedRows];

      const newWorksheet = XLSX.utils.aoa_to_sheet(newSheetData);

      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Processed Data');
      const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      setResult(URL.createObjectURL(blob));
    };

    fileReader.readAsArrayBuffer(googleSheet);
  };


  const fetchTokenData = async (username, tokenId) => {
    try {
      const tokenDocRef = doc(db, 'users', username, 'tokens', tokenId);
      const tokenDoc = await getDoc(tokenDocRef);

      if (tokenDoc.exists()) {
        return tokenDoc.data();
      } else {
        console.error('No such document!');
        return null;
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
      return null;
    }
  };

  return (
    <div>
      <Navbar />
    <div className="educator-container">
      <h1>Synth-XL</h1>
      <form onSubmit={handleSubmit}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop a Excel or Sheets file here, or click to select one</p>
          <p>.xlsx should be in format: timestamp, pid, url</p>
        </div>
        <button type="submit">check</button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <h2>Processed Data</h2>
          <a href={result} download="processed_data.xlsx">Download Processed Data</a>
        </div>
      )}
    </div>
    </div>
  );
};

export default Educator;
