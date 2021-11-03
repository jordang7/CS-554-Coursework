const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid');
const axios = require("axios");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const config = {
  headers:{
    "Authorization":"Client-ID By-d2g5yDCToYdKjeEPU2KTbJlNd9jKhJHGoLuMK45M"
  }
}

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }
  type Query {
    unsplashedImages(pageNum:Int!): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }
  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id:ID!
      url:String
      posterName:String
      description:String
      userPosted:Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(
      id:ID!
  ) : ImagePost
  }

`;
const ImagePost = [

  ];
  newImage={
    "id": 1,
    "url": "test",
    "posterName": "test1",
    "description": "desc",
    "userPosted": true,
    "binned": false,
  }
//client.saddAsync("BinnedImages",JSON.stringify(newImage)).then((res)=>{console.log(res)})
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      unsplashedImages: (_,args)=>  {
      //console.log(args.pageNum)
      let posts=[]
      return axios.get(`https://api.unsplash.com/photos/?page=${args.pageNum}`,config)
      .then((res) => {

        //console.log(res)
        let data = Object.values(res.data);

        for(let i =0;i<data.length;i++){
          let newImage = {
            "id":data[i].id,
            "url":data[i].urls.regular,
            "posterName": data[i].user.name,
            "description":data[i].description,
            "userPosted":false,
            "binned":false
          }

          //console.log(img)
          //client.saddAsync("BinnedImages",JSON.stringify(newImage)).then((res)=>{console.log(res)})

          let binned = false;
          let found = false
          console.log(ImagePost.length)
          if( ImagePost.length<10){
            posts.push(newImage);
            ImagePost.push(newImage)
          }else{
            for (let i of ImagePost){
              if(i.id==newImage.id && i.binned==true){
                console.log("1",newImage.id=='VNcWRWZn4Dw')
                console.log(i.id)
                posts.push(i);
                binned = true;
              }
              else if(i.id==newImage.id){
                posts.push(i);
                found =true
              }
            }
            if(!binned && !found){
              console.log(newImage)
              posts.push(newImage);
              ImagePost.push(newImage)
            }
          }

        }
        return posts
      })

      },
      binnedImages: () =>
        client.smembersAsync("BinnedImages").then((res)=>{
          for(let i =0;i<res.length;i++){
            res[i] = JSON.parse(res[i])
          };
          return res
        })
        ,
      userPostedImages: () => ImagePost.filter(v=> v.userPosted==true)
    },
    Mutation: {
      uploadImage:(_,args) =>{
        const newImage = {
          "id":uuid.v4(),
          "url":args.url,
          "posterName": args.posterName,
          "description":args.description,
          "userPosted":true,
          "binned":false
        };
        ImagePost.push(newImage);
        return newImage;
      },
      updateImage:(_,args) => {
        let newImage;
        console.log("update",args)
        ImagePost.map((e) => {
          if(e.id == args.id){
            if(args.url){
              e.url = args.url
            }
            if(args.posterName){
              e.posterName = args.posterName
            }
            if(args.description){
              e.description = args.description
            }
            if(args.userPosted){
              e.userPosted = args.userPosted
            }
            if(args.binned){
              if(!e.binned){
                e.binned = args.binned
                client.saddAsync("BinnedImages",JSON.stringify(e)).then((res)=>{console.log("bin",res)})
              }
            }else{
              if(e.binned){
                client.sremAsync("BinnedImages",JSON.stringify(e)).then((res) => {console.log("unbin",res)})
                e.binned = args.binned
              }
            }
            newImage = e;
            return e;
          }
          return e;
        });
        return newImage
      },
      deleteImage:(_,args) =>{
        let image;
        ImagePost.map((e)=>{
          if(e.id === args.id){
            client.sremAsync("BinnedImages",JSON.stringify(e)).then((res) => {console.log("binned",res)})
            console.log(ImagePost.indexOf(e))
            ImagePost.splice(ImagePost.indexOf(e),1)
          }
          image = e
          return e
        })
        return image
      }
    }
  };
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
