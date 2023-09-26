const router = require("express").Router();
const authController = require('../controllers/auth');

router.get('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.put('/update/:id', authController.update);
// router.get('/auth/logout', authController.logout);

module.exports = router;

//logout
// router.get("/auth/logout", async(req,res)=>{
//     try {
//         const token = await req.cookies.jwt;
//         console.log(req.cookies.jwt);
//         // const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
//         // console.log(verifyUser);
//         // next();
//         const user = await Client.findOne({_id:token._id});
//         console.log(user.name);

//         // req.token = token;
//         // req.user = user;

//         // req.user.tokens = req.user.tokens.filter((currToken)=>{
//         //     return currToken.token !== req.token
//         // })

//         // res.clearCookie("jwt");
//         // res.status(200).json("logout done")
//         // console.log("logout done");
//         // await req.user.save();
//         // res.render("login");
//     } catch (err) {
        
//     }
// })