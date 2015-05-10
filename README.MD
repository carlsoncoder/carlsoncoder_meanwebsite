# CarlsonCoder's custom blog website

This is the source code for my custom blogging website, which you can see at [carlsoncoder.com](http://www.carlsoncoder.com)

## So - What is this?
This is a full-stack MEAN application.  MEAN stands for MongoDB-Express-AngularJS-NodeJS.  You can read more about it [here](http://mean.io/#!/).  Everything is written in JavaScript!

## What are some of the components used?
I used a ton of different open source and free components to make this website what it is.  This was originally all written in C# ASP.NET w/Nancy, and hosted on Azure.  It has been completely rewritten with all original functionality and even some cool new added stuff!  Here's a quick breakdown of the major components
+ [MongoDB](https://www.mongodb.org/)
    +  MongoDB is the back-end NoSQL datastore storing all data from my blog site.
+ [Mongoose](http://mongoosejs.com/)
    +  Mongoose is a Node module that makes it incredibly easy to interact with a MongoDB datastore - think of it as an ORM for Node/MongoDB
+ [Express](http://expressjs.com/)
    + Express is the middleware that drives all request and response routing in a NodeJS application
+ [AngularJS](https://angularjs.org/)
    + I bet you probably know about Angular already.  But if not, check it out.  It's an amazing MVVM JavaScript framework
+ [NodeJS](https://nodejs.org/)
    + Server-Side JavaScript running using the Google V8 JavaScript engine to execute code and serve as a web server!
+ AWS S3
    +  I use AWS S3 storage to store all images that you see on this site
+ [Gulp](http://gulpjs.com/)
    +  Gulp is a lightweight JavaScript task-runner/build system
+ [Bootstrap](http://getbootstrap.com/)
    + Awesome CSS library!


## Things to note...
If you choose to clone this repository and use it to start making your own blog site, there are a few things you should know:

+ There are a few places that have hard-coded references to "carlsoncoder.com".  You will likely want to remove those and implement your own logic.
+ Likewise, I also have some hard-coded links to my GitHub, LinkedIn, Twitter, and email at various places in the code.
+ I intentionally excluded a critical file from this repository.  You will need to add a file to the "config" directory, called "config.js".  In there, you need to define a JSON object and export it, like such:
```
var options = {
            DISQUS_SHORT_NAME :             "",
            JWT_SECRET_KEY :                "",
            MY_NODE_ENV :                   "development",
            MONGO_DB_CONNECTION_STRING :    "",
            S3_REGION_NAME :                "",
            S3_BUCKET_NAME :                "",
            S3_ACCESS_KEY_ID :              "",
            S3_SECRET_ACCESS_KEY :          "",
            S3_ACL_POLICY :                 "public-read",
            S3_USE_SSL :                    true,
            GA_ACCOUNT_ID :                 ""
};
module.exports = options;
```
+ You will need to provide your own values for all of the above mentioned values.  Failure to add this file or provide values for all specified options will likely cause things to not work : )

## Known Modifications
+ tinymce.js would give the following error:
    + **TypeError: Cannot read property '$$phase' of null at updateView (tinymce.js:16)**
    + Referenced [https://github.com/angular-ui/ui-tinymce/issues/82](https://github.com/angular-ui/ui-tinymce/issues/82) and manually updated the file at /bower_components/angular-ui-tinymce/src/tinymce.js as suggested
    
## License
This code is free of license, however, referenced 3rd party components are likely bound by their own terms and licenses.

## Questions?
Feel free to reach me on [Twitter](https://twitter.com/carlsoncoder) or feel free to email me at [justin@carlsoncoder.com](mailto:justin@carlsoncoder.com)
