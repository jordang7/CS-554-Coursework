const express = require('express');
const app = express();
const connection = require("./config/mongoConnection.js");
const moviesData = require("./data/movies.js");
const { ObjectID } = require("mongodb");
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const { movies } = require('./config/mongoCollections');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configRoutes(app);
const port = 3000;
app.listen(port, () => {
    console.log(`The routes are running on http://localhost:${port}`);
});
// const main = async() =>{
//     try{
//         let ironMan = await moviesData.createMovie(
//             "iron man",
//             "A billionaire industrialist and genius inventor, Tony Stark (Robert Downey Jr.), is conducting weapons tests overseas, but terrorists kidnap him to force him to build a devastating weapon. Instead, he builds an armored suit and upends his captors. Returning to America, Stark refines the suit and uses it to combat crime and terrorism.",
//             "PG-13",
//             ["Robert Downey Jr", "Gwyneth Paltrow"],
//             { director: "Jon Favreau", yearReleased: 2008 }
//         );
//         // console.log("hello",await moviesData.getMovieById(ironMan._id))
//     }catch(e){
//         console.error(e)
//     }
//     try{
//         let joker = await moviesData.createMovie(
//             "Joker",
//             "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker",
//             "R",
//             ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
//             { director: "Todd Phillips", yearReleased: 2019 }
//           );
//     }catch(e){
//         console.error(e)
//     }
//     try{
//         let bigDaddy = await moviesData.createMovie(
//             "Big Daddy",
//             "Thirty-two-year-old Sonny Koufax (Adam Sandler) has spent his whole life avoiding responsibility. But when his girlfriend dumps him for an older man, he's got to find a way to prove he's ready to grow up. In a desperate last-ditch effort, Sonny adopts 5-year-old Julian (Dylan Sprouse), (Cole Sprouse) to impress her. She's not impressed ... and he can't return the kid. Uh-oh for Sonny!",
//             "PG-13",
//             ["Adam Sandler", "Cole Sprouse", "Dylan Sprouse"],
//             { director: "Dennis Dugan", yearReleased: 1999 }
//           );

//     }catch(e){
//         console.error(e)
//     }
    // console.log("---------SHOULD THROW ERRORS----------------");
    // try {
    //     let joker1 = await moviesData.createMovie(
    //       " title",
    //       "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker",
    //       143,
    //       "2h 2m",
    //       "Thriller",
    //       ["Person one", "", ""],
    //       { director: "hi", yearReleased: 1930 }
    //     );
    //     console.log(joker1);
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   try {
    //     console.log(await moviesData.remove(1234));
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   try {
    //     console.log(await moviesData.remove("jfdsa4313490"));
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   try {
    //     console.log(await moviesData.getMovieById(" "));
    //   } catch (error) {
    //     console.error(error);
    //   }

    // try{
    //     console.log(await moviesData.getAllMovies())
    // }catch(e){
    //     console.error(e)
    // }
    // const db = await connection();
//     // await db.serverConfig.close();
// };
// main();

