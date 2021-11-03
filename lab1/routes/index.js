const moviesRoutes = require('./movies');

/*
The first will keep a count of the total number of requests to the server
The second will log all request bodies, as well as the url path they are requesting, and the HTTP verb they are using to make the request
The third will keep track of many times a particular URL has been requested, updating and logging with each request.*/

const constructorMethod = (app) => {
  //count requests
  let requests =0;
  app.use(function(req,res,next){
    requests++
    console.log(`total number of requests=${requests}`)
    next();
  });
  app.use(function(req,res,next){
    console.log(`${req.method}` + " "+ `${req.originalUrl}` + " " + JSON.stringify(req.body));
    next();
  });

  const urlPaths={};
  app.use(function(req,res,next) {
    if(urlPaths[req.path]){
        urlPaths[req.path]++;
    }else{
      urlPaths[req.path]=1;
    }
    console.log(`${req.path}` +" has been requested "+`${urlPaths[req.path]}`+" times ")
    next();
  })

  app.use('/movies', moviesRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;