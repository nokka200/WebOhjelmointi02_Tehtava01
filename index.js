const express = require('express');
const fs = require("fs").promises;

// alustetaan express ja tarvittavat middlewaret
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// variables
const fileName = 'sanakirja.txt';
const encoding = 'utf8';


// API

// GET api/words:target haetaan tietty sana sanakirjasta ja palautetaan sen käännös. Tarvitsee suomen kielisen sanan ja palauttaa englanninkielisen sanan.
app.get('/api/words/:target', async (req, res) => {
  const target = String(req.params.target);
  const data = await fs.readFile(fileName, encoding);
  const allWords = data.split(/\r?\n/);
  const dictionary = [];

  // käydään läpi kaikki sanat tekstitiedostosta ja luodaan niistä taulukko
  allWords.forEach((line) => {
    const words = line.split(" "); //sanat taulukkoon words
    const word = {
      fin: words[0],
      eng: words[1],
    };
    dictionary.push(word);
  });

  // etsitään taulukosta kohdesana
  const result = dictionary.find(word => word.fin === target);

  // palautetaan käännös jos sellainen löytyy
  if (result) {
    res.status(200).json({ translation: result.eng });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// POST api/words: lisätään uusi sana sanakirjaan. Tarvitsee suomenkielisen sanan ja sen englanninkielisen käännöksen.
app.post('/api/words/', async (req, res) => {
  const { fin, eng } = req.body;
  await fs.appendFile(fileName, `${fin} ${eng}\n`);

  res.status(201).json({ fin: fin, eng: eng });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});