const express = require('express');
const fasta2json = require('fasta2json');

const app = express();
app.use(express.static('public'));

const fasta = fasta2json.ReadFasta('./sequenc_logo_data.fasta');

const map = [];
for (let i = 0; i < fasta[0].seq.length; i++) {
  let currentPosition = '';
  for (let j = 0; j < fasta.length; j++) {
    currentPosition += fasta[j].seq[i];
  }
  map.push(currentPosition);
}

const positionFrequencies = [];
for (let position of map) {
  let positionFrequency = {};
  for (let c of position) {
    if (c in positionFrequency) {
      positionFrequency[c]++;
    } else {
      positionFrequency[c] = 1;
    }
  }
  positionFrequencies.push(positionFrequency);
}

const d3Data = [];
for (let i = 0; i < positionFrequencies.length; i++) {
  let position = [];
  for (let x of Object.keys(positionFrequencies[i])) {
    let obj = {};
    obj.letter = x;
    obj.frequency = positionFrequencies[i][x] / 6;
    position.push(obj);
  }
  d3Data.push(position);
}

app.get('/data', (req, res) => {
  res.json(d3Data);
});

app.listen(8080, () => {
  console.log('listening on port 8080');
});
