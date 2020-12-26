import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import App from 'components/App';
const path = require('path');

const addon = require('bindings')('box_geometry')

function calculateBox(width, height, lenght) {
  return addon.calculate_box_vertices(width, height, lenght);
}

const app = express();

app.use((req, res) => {
  if (req.path == "/calculate") {
    var width = req.query.width
    var height = req.query.height
    var length = req.query.length
    if (!isNaN (width) && !isNaN (height) && !isNaN (length)) {
      var result = calculateBox(Number(width), Number(height), Number(length));
      console.log(result);
      res.send(result);
    }
  } else if (req.path == "/assets/styles.css") {
    res.sendFile(path.resolve("./public/assets/styles.css"));
  } else if (req.path == "/assets/bundle.js") {
    res.sendFile(path.resolve("./public/assets/bundle.js"));
  } else {
    const componentHTML = ReactDom.renderToString(<App />);
    return res.end(renderHTML(componentHTML));
  }
});

// const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
          <link rel="stylesheet" href="/assets/styles.css">
      </head>
      <body>
      <div id="react-view"></div>
        <script type="application/javascript" src="/assets/bundle.js"></script>
      </body>
    </html>
  `;
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});