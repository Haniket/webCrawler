const cors = require('cors');
const express = require('express');
require('dotenv').config();
const crawlerService = require('./services/crawler.services');
const app = express();
app.use(cors());
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('server is active'));
app.get('/makeMap', crawlerService.getLinks);
app.get('/resetMap', crawlerService.resetMap);
app.get('/getUrlCount', crawlerService.getUrlCounts);
app.get('/getLinkedUrls', crawlerService.getLinkedUrls);
app.get('/getAllDomain', crawlerService.getAllDomain);
// app.get("/makeMap",(req,res)=>{
//   console.log(req);
// })
app.listen(3000, () => {
  console.log('server is running on port 3000');
});
