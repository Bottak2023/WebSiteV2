// pages/api/fetchData.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // URL del Google Apps Script (reemplaza con tu propia URL)
    const url = 'https://script.google.com/macros/s/AKfycbwCWr9GINP2dsJJP_7dw--BE3ed7Jt4uANGlmMXIckJcLfTevaHdGJCqs-dN8b6apsUzw/exec';
console.log(req.body)
    try {
      // Realiza la solicitud POST
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tipo de contenido
        },
        body:  JSON.stringify(req.body),
      });

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convierte la respuesta a JSON
      console.log(data)
      const data = await response.json();
      res.status(200).json(data); // Envía la respuesta al cliente

    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores
    }

  } else {
    // Manejo de métodos no permitidos
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
