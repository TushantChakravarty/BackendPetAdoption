const router = require("express").Router();
const facade = require('./userFacade');
const validators = require('./userValidators');
const usrConst = require('./userConstants');
const mapper = require('./userMapper');
const { genUsrToken } = require('../jwtHandler');
const auth  = require('../middleware/auth')
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log(file)
    cb(null,  file.originalname + ".");
  },
});
//+ file.originalname.split(".").pop()
const storage2 = multer.diskStorage({
    destination: "./profilephotos/",
    filename: function (req, file, cb) {
      console.log(file)
      cb(null,  file.originalname );
    },
  });

  var MultipleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage: MultipleStorage });
const diskStorage = multer({ storage: storage });
const diskStorage2 = multer({ storage: storage2 });


router.route('/register').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.register(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})


router.route('/confirmotp').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.confirmOtp(details).then((result) => {
        console.log(result)
        
            res.send(result)
        
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})




router.route('/login').post( (req, res) => {

    let details = req.body

    facade.login(details).then((result) => {
        console.log(result)
        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})


router.route('/addPost').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.addPosts(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/allPosts').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.allPosts(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/getAllPosts').get( (req, res) => {

    
    facade.getAllPosts().then((result) => {
        console.log(result)
        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})



router.route('/uploadPhotos').post(diskStorage.single("image"), (req, res) => {
    
    try {
      console.log(req.file); // File which is uploaded in /uploads folder.
      console.log(req.body); // Body
      res.send({ status: "Success", data:req.file });
    } catch (error) {
      res.status(500).send("Error");
    }
  });
  router.route('/uploadProfilePhoto').post(diskStorage2.single("image"), (req, res) => {
    
    try {
      console.log(req.file); // File which is uploaded in /uploads folder.
      console.log(req.body); // Body
      res.send({ status: "Success", data:req.file });
    } catch (error) {
      res.status(500).send("Error");
    }
  });

  router.route('/createProfile').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.createProfile(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/getUserProfile').post( (req, res) => {

    
    facade.getUserProfile(req.body).then((result) => {
        console.log(result)
        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/multipleupload').post(upload.array('image',5),
(req, res) => {
  try {
    console.log(res.files); // File which is uploaded in /uploads folder.
    console.log(req.files); // Body
    res.send({ status: "Success", data:req.files });
  } catch (error) {
    res.status(500).send("Error");
  }

});


module.exports = router