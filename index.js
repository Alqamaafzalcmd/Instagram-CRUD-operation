const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

// to take image in form -----------
const multer = require("multer");
const upload = multer({ dest: 'public/uploads' });

// to assign unique id to all post
const { v4: uuidv4 } = require("uuid");
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

// to override method
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


// to parse the data ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public/style")));
app.use(express.static(path.join(__dirname, "public/assets")));
app.use(express.static(path.join(__dirname, "public/image_content")));
app.use(express.static(path.join(__dirname, "public/uploads")));

app.listen(port, () => {
  console.log(`app is listening on ${port} ....`);
})


let user = {
  name: "Alqama Afzal",
  post: 1,
  image: "myimage.png",
  followers: 92,
  following: 13,
};

let posts = [
  {
    id: "1abc",
    image: "cat.jpg",
    content: "Today I purchased a cat, she is so cute really !!",
    likes: 34,
    comments: [
      {
        comments1: "nice cat",
        comments2: "what was the price of cat",
      }
    ],

  },


  {
    id: uuidv4(),
    image: "dog.jpg",
    content: "Today I purchased a dog, she is so cute really !!",
    likes: 34,
    comments: [
      {
        comments1: "nice cat",
        comments2: "what was the price of cat",
      }
    ],

  },



  {
    id: uuidv4(),
    image: "cat.jpg",
    content: "Today I purchased a cat, she is so cute really !!",
    likes: 34,
    comments: [
      {
        comments1: "nice cat",
        comments2: "what was the price of cat",
      }
    ],

  },




  {
    id: uuidv4(),
    image: "dog.jpg",
    content: "Today I purchased a dog, she is so cute really !!",
    likes: 34,
    comments: [
      {
        comments1: "nice cat",
        comments2: "what was the price of cat",
      }
    ],

  }
]


// home route to show all post ------------
app.get("/home", (req, res) => {
  //    res.send("welcome to page of Alqama Afzal");
  res.render("index.ejs", { user, posts });
});




// to add new post it will send a form -------------
app.get("/home/new", (req, res) => {
  console.log("sending a form");
  res.render("new.ejs");
});

// to read binary file of image and convert it into png or jpg any readable form---------
const sharp = require("sharp");

// to delete binary file of image which is saved when we upload the image --------- 
// const fs = require("fs");can work without this as it only delete the path not containing .pnj or jpg



// it will add new post to profile submitted in post
app.post("/home", upload.single("image"), async (req, res) => {
  // console.log(req.file);
  console.log(req.body);

  const outputPath = `public/uploads/${req.file.filename}.png`;

  await sharp(req.file.path)
    .png()
    .toFile(outputPath)
    .then(() => {
      console.log("Image Saved Successfully");
    })
    .catch(() => {
      console.log("Image not saved")
    })

  //   fs.unlinkSync(req.file.path); // delete original

  const newPost = {
    id: uuidv4(),
    image: `${req.file.filename}.png`,
    content: req.body.content,
    likes: 0,
    comments: []
  };

  //   console.log(newPost.image);
  posts.push(newPost);
  res.redirect("/home");
});





// to show in detail for any post------------
app.get("/home/:id", (req, res) => {
  let { id } = req.params;

  let post = posts.find((p) => id === p.id);
  console.log(post);
  res.render("show.ejs", { post });

});


// to update the post  send a form ------------------------
app.get("/home/:id/edit", (req, res) => {
  let { id } = req.params;
  // console.log("Editing path");
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post });
});



//----------------
app.patch("/home/:id", upload.single("image"), async (req, res) => {

  let { id } = req.params;
  // console.log(id);
  // console.log(req.body);
  // console.log(req.file);
  const newContent = req.body.content;


  // updating content
  let post = posts.find((p) => id === p.id);
  post.content = newContent;

// if user don't want to edit image
  if (req.file) {
    // updating image
    let newImage = `${req.file.filename}.png`;
    post.image = newImage;



    const outputPath = `public/uploads/${req.file.filename}.png`;
    await sharp(req.file.path)
      .png()
      .toFile(outputPath)
      .then(() => {
        console.log("Image Saved Successfully");
      })
      .catch(() => {
        console.log("Image not saved")
      })

   

  }

   res.redirect("/home");

});


app.delete("/home/:id", (req, res) => {
  console.log("deleting");
  let {id} = req.params;

  posts = posts.filter((p) => id !== p.id);

  res.redirect("/home");
})







