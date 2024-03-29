import React, { useState } from 'react';
import head from './images/head.png';
import brown from './images/brownhair.png';
import blond from './images/blondhair.png';
import pdf from './SamplePDF.pdf';
import football from './images/football.png';
import { PDFDocument } from 'pdf-lib';
import './App.css';

function App() {
  const [selectedHairColor, setSelectedHairColor] = useState('none');

  const changeHairColor = (event) => {
    setSelectedHairColor(event.target.value);

    var hairImages = document.getElementsByClassName("hairImage");
    for (var i = 0; i < hairImages.length; i++) {
      hairImages[i].style.display = "none";
    }

    if (event.target.value !== "none") {
      var selectedHairImage = document.getElementById(event.target.value + "HairImage");
      selectedHairImage.style.display = "block";
    }
  }

  const generatePDF = async () => {
    try {

      const existingPdfBytes = await fetch(pdf).then(res => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const firstPage = pdfDoc.getPage(1);

      const headImageBytes = await fetch(football).then(res => res.arrayBuffer()); // Zmena na obrázok futbalovej lopty
      const headImage = await pdfDoc.embedPng(headImageBytes);

      let hairImageBytes;
      if (selectedHairColor === "brown") {
        hairImageBytes = await fetch(brown).then(res => res.arrayBuffer());
      } else if (selectedHairColor === "blonde") {
        hairImageBytes = await fetch(blond).then(res => res.arrayBuffer());
      }
      const hairImage = await pdfDoc.embedPng(hairImageBytes);

      firstPage.drawImage(headImage, {
        x: 50,
        y: 370,
        width: 200,
        height: 200,
      });

      if (selectedHairColor !== "none") {
        firstPage.drawImage(hairImage, {
          x: 130,
          y: 523,
          width: 40,
          height: 40,
        });
      }

      const pdfBytes = await pdfDoc.save();

      const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));

      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = 'Kniha.pdf';
      downloadLink.click();
    } catch (error) {
      console.error('Chyba pri generovaní PDF:', error);
    }
  }

  return (
      <div className="App">
        <header className="App-header">

          <div id="characterImage">
            <img id="headImage" src={head} alt="Hlava" />
            <img id="brownHairImage" className="hairImage" src={brown} alt="Hnedé vlasy" />
            <img id="blondeHairImage" className="hairImage" src={blond} alt="Blond vlasy" />
          </div>

          <select id="hairColorSelect" onChange={changeHairColor} value={selectedHairColor}>
            <option value="none">Žiadne vlasy</option>
            <option value="brown">Hnedé vlasy</option>
            <option value="blonde">Blond vlasy</option>
          </select>
          <br></br>
          <button onClick={generatePDF}>Vytvoriť PDF</button> {/* Zmena textu tlačidla */}

        </header>
      </div>
  );
}

export default App;
