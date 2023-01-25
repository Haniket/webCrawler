const jsdom = require('jsdom');
const got = require('got');
const { getDriver } = require('./db.service');
const { JSDOM } = jsdom;
const driver = getDriver();

var crawlService = {};
crawlService.getLinks = getLinks;
crawlService.resetMap = resetMap;
crawlService.getUrlCounts = getUrlCounts;
crawlService.getLinkedUrls = getLinkedUrls;
crawlService.getAllDomain = getAllDomain;
module.exports = crawlService;


async function getAllDomain(req,res){
  const response=[];
  const session=driver.session({database:'neo4j'});
  const result=await session.run(
    `MATCH (n:DomainURL) RETURN n.domain as domain`
  )
  .catch(err => {
    console.log("error in getAllDomain");
    res.send("error in getAllDomain");
    session.close();
  });
  session.close();
  for await(record of result.records){
    
    response.push(record.get('domain'))  
  }
  res.send(response);
}

async function getUrlCounts(req,res){
  const domain=req.query.domain;
  const session = driver.session({ database: 'neo4j' });
  const response=[];
  const result = await session
    .run(
      `Match (p:PageURL) where p._id starts with "${domain}" with p 
      MATCH (n)<-[r]-() where n._id=p._id RETURN p._id as _id ,count(r) as count ORDER BY count(r)
      DESC`
    )
    .catch((err) => {
      console.log('err in getUrlcount', err);
      session.close();
    });
  session.close();
  for await(record of result.records){
    var obj={};
    obj["_id"]=record.get('_id');
    obj["count"]=record.get('count').low;
    response.push(obj)  
  }
  res.send(response);
}

async function getLinkedUrls(req,res){
  var siteUrl = req.query.url;
  const response=[];
  const session = driver.session({ database: 'neo4j' });
  const result = await session
    .run(
      `MATCH (p)-[r:LINKS_TO]->({_id:"${siteUrl}"}) with r.anchorText as at ,p._id as _id
      return collect(DISTINCT {anchorText:at,_id:_id}) as json `
    )
    .catch((err) => {
      console.log('err in getUrlcount', err);
      session.close();
    });
  session.close();
  for await(record of result.records){
    response.push(record.get("json"))  
  }
  res.send(response[0]);
}

async function resetMap(req, res) {
  const session = driver.session({ database: 'neo4j' });
  session
    .run(`MATCH (p:PageURL {marked : 'true'}) REMOVE p.marked return p`)
    .then(res.send('successfully reseted '))
    .catch((err) => {
      console.log('err in Reseting Map', err);
      session.close();
    });
}

async function getLinks(req, res) {
  var siteUrl = req.query.siteUrl;
  // console.log(siteUrl);
  await createNode(siteUrl);
  await createDomain(siteUrl, siteUrl);
  await build(siteUrl, siteUrl);
  res.send('success hit');
}

const build = async (siteUrl, domain) => {
  await createNode(siteUrl);

  await got(siteUrl)
    .then(async (response) => {
      const dom = new JSDOM(response.body);
      let head = dom.window.document
        .querySelector('head')
        .textContent.replace(/"/g, '\\"')
        .replace(/'/g, "\\'");
      let body = dom.window.document
        .querySelector('body')
        .textContent.replace(/"/g, '\\"')
        .replace(/'/g, "\\'");
      await feedData(siteUrl, head, body);
      for (let link of dom.window.document.querySelectorAll('a')) {
        if (
          link.href.startsWith(domain) &&
          !link.href.includes('/tag/') &&
          !link.href.includes('/author/')&&!link.href.includes('/category/')&&!link.href.includes('?amp')&&!link.href.includes('?noamp')
        ) {
          await createNode(link.href);
          await createRelation(siteUrl, link.textContent, 'url', link.href);
        } else if (
          link.href.startsWith('/') &&
          link.href.length > 1 &&
          !link.href.includes('cdn-cgi') &&
          !link.href.includes('/tag/') &&
          !link.href.includes('/author/')&&!link.href.includes('/category/')&&!link.href.includes('?amp')&&!link.href.includes('?noamp')
        ) {
          let childUrl = siteUrl.concat(link.href.substring(1));
          console.log('child ', childUrl);
          await createNode(childUrl);
          await createRelation(siteUrl, link.textContent, 'uri', childUrl);
        }
      }
    })
    .catch((err) => {
      feedErrorData(siteUrl,err);
      console.error('error in got function');
    });
  const unvisitedNode = await filterNode();
  for await (i of unvisitedNode.records) {
    setTimeout(function () {
      console.log('records', i._fields[0].properties._id);
      build(i._fields[0].properties._id, domain);
    }, 5000);
  }
};

const createNode = async (siteUrl) => {
  const session = driver.session({ database: 'neo4j' });
  const result = await session
    .run(`MERGE (p:PageURL {_id : '${siteUrl}'}) return p`)
    .catch((err) => {
      console.log('err in create Node', err);
      session.close();
    });
  session.close();
  return result;
};

const createDomain = async (siteUrl, domainUrl) => {
  const session = driver.session({ database: 'neo4j' });
  const result = await session
    .run(
      `MERGE (d:DomainURL {domain : '${domainUrl}'} ) 
    MERGE (p:PageURL {_id: '${siteUrl}'}) 
    MERGE (d)-[:DOMAIN_OF {Domain: "entry_point"}]->(p)  return d, p
    `
    )
    .catch((err) => {
      console.log('err in create Domain', err);
      session.close();
    });
  // console.log("domain",result)
  session.close();
  return result;
};

const createRelation = async (parentUrl, text, type, childUrl) => {
  return new Promise(async (resolve, reject) => {
    const session2 = driver.session({ database: 'neo4j' });
    const child = await session2
      .run(
        `MATCH (p:PageURL {_id: '${parentUrl}'})
         MATCH (cp:PageURL {_id: '${childUrl}'}) 
         MERGE (p)-[:LINKS_TO {anchorText: "${text}",anchorType: '${type}'}]->(cp)  return cp, p`
      )
      .catch((err) => {
        console.log('err in create relation', err);
        reject();
        session2.close();
      });
    resolve(child);
  });
};

const feedData = async (siteUrl, head, body) => {
  const session1 = driver.session({ database: 'neo4j' });
  const result = session1
    .run(
      `MATCH (p:PageURL {_id : $siteUrl}) SET  p.title ='${head}', p.body ='${body}', p.marked='true' return p`,
      { siteUrl }
    )
    .catch((err) => {
      console.log('err in feeding data', err);
      session1.close();
    });
  return result;
};

const feedErrorData = async (siteUrl,err) => {
  const session1 = driver.session({ database: 'neo4j' });
  const result = session1
    .run(
      `MATCH (p:PageURL {_id : $siteUrl}) SET  p.title ='no head ${err}',p.err ='error found ${err}', p.body ='no body ${err}', p.marked='true' return p`,
      { siteUrl }
    )
    .catch((err) => {
      console.log('err in feeding data', err);
      session1.close();
    });
  return result;
};

const filterNode = async () => {
  return new Promise(async (resolve, reject) => {
    const session = driver.session({ database: 'neo4j' });
    const result = await session
      .run(`MATCH (p:PageURL) WHERE p.marked is NULL RETURN p LIMIT 1`)
      .catch((err) => {
        console.log('err in filtering node', err);
        session.close();
      });
    resolve(result);
  });
};
