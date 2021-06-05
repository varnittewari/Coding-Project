const knex = require("knex");
const express = require("express");

const app = express();

const connectionString = require("./connectionString");
const mustacheExpress = require("mustache-express");

const client = knex({
  client: "pg",
  connection: connectionString,
});

/* const server = app.createServer();
server.pre(app.pre.sanitizePath());
server.pre(app.pre.userAgentConnection()); */
app.listen(8080);

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");

app.set("views",__dirname+ "/views");

app.get('/', async function(req,res,next){
  let sites = await client.from("construction_sites").select("*");
  let array = {sites : sites};
  res.render('index', array);
});

app.get('/site/:id', async function(req,res){
  let materials = await client.from("materials").select("*").where({
    construction_site_id: req.params.id
  });
  console.log(materials);
});

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  const shutdownTimeout = setTimeout(function () {
    console.log("Shutdown failed, terminating process.");
    process.exit(0);
  }, 5000);

  console.log("Closing server connections...");
  app.close(() => {
    console.log("Closing database connections...");
    client.destroy();
    clearTimeout(shutdownTimeout);
    console.log("Shutdown successful.");
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
