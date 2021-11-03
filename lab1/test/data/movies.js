const mongoCollections = require("./../config/mongoCollections");
const movies = mongoCollections.movies;
const { ObjectID } = require("mongodb");

async function createMovie(title, plot, rating, cast, info) {
  var curr = new Date().getFullYear() + 5;
  if (title === undefined || title === null) {
    throw new Error("title is not a valid argument");
  } else if (typeof title != "string") {
    throw new Error("title argument is not a string");
  } else if (title === "" || /^\s+$/.test(title)) {
    throw new Error("title is empty string");
  }
  if (plot === undefined || plot === null) {
    throw new Error("plot is not a valid argument");
  } else if (typeof plot != "string") {
    throw new Error("plot argument is not a string");
  } else if (plot === "" || /^\s+$/.test(plot)) {
    throw new Error("plot is empty string");
  }
  if (rating === undefined || rating === null) {
    throw new Error("rating is not a valid argument");
  } else if (typeof rating != "string") {
    throw new Error("rating argument is not a string");
  } else if (rating === "" || rating.trim() === "") {
    throw new Error("rating is empty string");
  }
  if (cast === undefined || cast === null) {
    throw new Error("cast is not a valid argument");
  } else if (!Array.isArray(cast)) {
    throw new Error("cast is not an array");
  } else {
    var countValid = 0;
    for (i = 0; i < cast.length; i++) {
      if (
        (typeof cast[i] == "string" && cast[i] != "") ||
        /^\s+$/.test(cast[i])
      ) {
        countValid++;
      }
    }
    if (countValid == 0) {
      throw new Error("cast doesn't contain at least one valid string");
    }
  }
  if (info === undefined || info === null) {
    throw new Error("info is not a valid argument");
  } else if (typeof info != "object") {
    throw new Error("info is not an object");
  } else if (
    typeof info.director != "string" ||
    info.director === "" ||
    /^\s+$/.test(info.director)
  ) {
    throw new Error("info.director is not a valid string");
  }else if (
    typeof info.yearReleased != "number" ||
    info.yearReleased.toString().length != 4
  ) {
    throw new Error("info.yearReleased is not a valid 4 digit number");
  } else if (info.yearReleased < 1930 || info.yearReleased > curr) {
    throw new Error("info.yearReleased not in bounds");
  }

  const newMovie = {
    _id: ObjectID(),
    title: title,
    plot: plot,
    rating: rating,
    cast: cast,
    info: info,
    comments: []
  };
  const movieCollection = await movies();
  const insertInfo = await movieCollection.insertOne(newMovie);

  if (insertInfo.insertedCount === 0) throw "Could not add movie";
  const newId = insertInfo.insertedId;
  const mov = await getMovieById(newId);
  return mov;
}

async function createComment(id,name,comment){
  if (id === undefined || id === null) {
    throw new Error("(createComment)id doesn't exist");
  } else if (typeof id !== "string") {
    throw new Error("(createComment)id is not a string");
  }
  if (name === undefined || name === null) {
    throw new Error("(createComment) name doesn't exist");
  } else if (typeof name !== "string") {
    throw new Error("(createComment)id is not a string");
  }
  if (comment === undefined || comment === null) {
    throw new Error("(createComment) comment doesn't exist");
  } else if (typeof comment !== "string") {
    throw new Error("(createComment)comment is not a string");
  }
  const moviesCollection = await movies();
  const movie = await this.getMovieById(id);
  if(!movie){
    throw new Error("(createComment)id is not valid")
  }
  let newComment = {
    _id: ObjectID(),
    name:name,
    comment:comment
  }
  let oID = ObjectID(id)
  const updatedInfo = await moviesCollection.updateOne(
    { _id: oID },
    { $addToSet: {comments:newComment} }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update movie successfully";
  }

  let mov = await this.getMovieById(id);

  return mov;

}
async function getAllMovies() {
  const movieCollection = await movies();
  const all = await movieCollection.find({}).toArray();
  return all;
}

async function getMovieById(id) {
  var oID = ObjectID(id);
  const moviesCollection = await movies();

  const movie = await moviesCollection.findOne({ _id: oID });
  if (!movie) {
    throw "no movie exists with that id";
  }
  return movie;
}

async function deleteComment(movieId,comId) {
  if (movieId == undefined || movieId == null) {
    throw new Error("(delete)movieId doesn't exist");
  } else if (typeof movieId !== "string") {
    throw new Error("(delete)movieId is not a string");
  } else if (movieId === "" || /^\s+$/.test(movieId)) {
    throw new Error("(delete) id is empty string");
  }
  if (comId == undefined || comId == null) {
    throw new Error("(delete)comId doesn't exist");
  } else if (typeof comId !== "string") {
    throw new Error("(delete)comId is not a string");
  } else if (comId === "" || /^\s+$/.test(comId)) {
    throw new Error("(delete) comId is empty string");
  }
  const movieCollection = await movies();
  const mov = await this.getMovieById(movieId);

  let commentOid=ObjectID(comId)
  let movieOid=ObjectID(movieId)
  const updateInfo = await movieCollection.updateOne(
                            {_id: movieOid},
                            {$pull: {comments: {_id: commentOid}}}
                            );
  if (!updateInfo.matchedCount ===1 && !updateInfo.modifiedCount) throw 'Update failed';
  let newMov = await this.getMovieById(movieId)

  return  newMov
}
async function putMovie(id, title,plot,rating,cast,info) {
  if (id == undefined || id == null || id === "" || /^\s+$/.test(id)) {
    throw new Error("(rename)id doesn't exist");
  } else if (typeof id !== "string") {
    throw new Error("(rename)id is not a string");
  }
  var curr = new Date().getFullYear() + 5;
  if (title === undefined || title === null) {
    throw new Error("title is not a valid argument");
  } else if (typeof title != "string") {
    throw new Error("title argument is not a string");
  } else if (title === "" || /^\s+$/.test(title)) {
    throw new Error("title is empty string");
  }
  if (plot === undefined || plot === null) {
    throw new Error("plot is not a valid argument");
  } else if (typeof plot != "string") {
    throw new Error("plot argument is not a string");
  } else if (plot === "" || /^\s+$/.test(plot)) {
    throw new Error("plot is empty string");
  }
  if (rating === undefined || rating === null) {
    throw new Error("rating is not a valid argument");
  } else if (typeof rating != "string") {
    throw new Error("rating argument is not a string");
  } else if (rating === "" || rating.trim() === "") {
    throw new Error("rating is empty string");
  }
  if (cast === undefined || cast === null) {
    throw new Error("cast is not a valid argument");
  } else if (!Array.isArray(cast)) {
    throw new Error("cast is not an array");
  } else {
    var countValid = 0;
    for (i = 0; i < cast.length; i++) {
      if (
        (typeof cast[i] == "string" && cast[i] != "") ||
        /^\s+$/.test(cast[i])
      ) {
        countValid++;
      }
    }
    if (countValid == 0) {
      throw new Error("cast doesn't contain at least one valid string");
    }
  }
  if (info === undefined || info === null) {
    throw new Error("info is not a valid argument");
  } else if (typeof info != "object") {
    throw new Error("info is not an object");
  } else if (
    typeof info.director != "string" ||
    info.director === "" ||
    /^\s+$/.test(info.director)
  ) {
    throw new Error("info.director is not a valid string");
  }else if (
    typeof info.yearReleased != "number" ||
    info.yearReleased.toString().length != 4
  ) {
    throw new Error("info.yearReleased is not a valid 4 digit number");
  } else if (info.yearReleased < 1930 || info.yearReleased > curr) {
    throw new Error("info.yearReleased not in bounds");
  }

  const moviesCollection = await movies();
  const prev = await this.getMovieById(id);
  const updatedMovie = {
      title: title,
      plot: plot ,
      rating: rating ,
      cast: cast,
      info: info,
      comments: prev.comments  };
      let oID = ObjectID(id)
  const updatedInfo = await moviesCollection.updateOne(
    { _id: oID },
    { $set: updatedMovie }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update movie successfully";
  }
  return await this.getMovieById(id);
}
async function patchMovie(id, title, plot, rating, cast, info) {
    if (id == undefined || id == null || id === "" || /^\s+$/.test(id)) {
        throw new Error("(path)id doesn't exist");
      } else if (typeof id !== "string") {
        throw new Error("(patch)id is not a string");
      }
    if(title === undefined && plot === undefined && rating === undefined && cast === undefined && info === undefined){
        throw new Error("(patch) No values to update")
    }
    const prev = await this.getMovieById(id);
    if(title === undefined || typeof title !== "string"){
        title = prev.title
    }else{
      if (title === undefined || title === null) {
        throw new Error("title is not a valid argument");
      } else if (typeof title != "string") {
        throw new Error("title argument is not a string");
      } else if (title === "" || /^\s+$/.test(title)) {
        throw new Error("title is empty string");
      }
    }
    if(plot ===undefined || typeof plot !== "string"){
        plot = prev.plot
    }else{
      if (plot === undefined || plot === null) {
        throw new Error("plot is not a valid argument");
      } else if (typeof plot != "string") {
        throw new Error("plot argument is not a string");
      } else if (plot === "" || /^\s+$/.test(plot)) {
        throw new Error("plot is empty string");
      }
    }
    if(rating ===undefined|| rating===null){
        rating = prev.rating
    }
    if(cast === undefined || cast === null|| typeof cast !== "object"){
        cast = prev.cast
    }else{
    if (!Array.isArray(cast)) {
        throw new Error("cast is not an array");
      } else {
        var countValid = 0;
        for (i = 0; i < cast.length; i++) {
          if (
            (typeof cast[i] == "string" && cast[i] != "") ||
            /^\s+$/.test(cast[i])
          ) {
            countValid++;
          }
        }
        if (countValid == 0) {
          throw new Error("cast doesn't contain at least one valid string");
        }
      }
    }
    if(info ===undefined || info ===null ){
        info = prev.info
    }else{
        if (typeof info != "object") {
          throw new Error("info is not an object");
        } else if (
          typeof info.director != "string" ||
          info.director === "" ||
          /^\s+$/.test(info.director)
        ) {
          throw new Error("info.director is not a valid string");
        }else if (
          typeof info.yearReleased != "number" ||
          info.yearReleased.toString().length != 4
        ) {
          throw new Error("info.yearReleased is not a valid 4 digit number");
        } else if (info.yearReleased < 1930 || info.yearReleased > curr) {
          throw new Error("info.yearReleased not in bounds");
        }
    }
    const updatedMovie = {
        title: title,
        plot: plot ,
        rating: rating ,
        cast: cast,
        info: info,
        comments: prev.comments  };
    const moviesCollection = await movies();
    let oID = ObjectID(id);
    const updatedInfo = await moviesCollection.updateOne(
      { _id: oID },
      { $set: updatedMovie }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update movie successfully";
    }
    return await this.getMovieById(id);
  }

module.exports = {
  createMovie,
  createComment,
  getMovieById,
  getAllMovies,
  putMovie,
  patchMovie,
  deleteComment,
};



