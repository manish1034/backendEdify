const bcrypt = require("bcrypt");
const Student = require("../models/User");
const { CCourses, SCourses } = require("../models/Courses");


exports.register = async(req, res, next)=>{
    try {
        let { hasedPass, ...studentData } = req.body;
        const { email, username, inWhat: studentIn, schoolstudent, collegestudent } = studentData; 
        hasedPass = await bcrypt.hash(req.body.password, 10);

        const existing_email = await Student.findOne({ email });
        const existing_user = await Student.findOne({ username });

        if (existing_user) {
        console.error("Username already exists.");
        return res.status(400).json({ error: "Username already exists" });        
        } else if (existing_email) {
        console.error("email already exists.");
        return res.status(400).json({ error: "Email already exists" });        
        }else if(req.body.cPass !== req.body.password){
            console.error("make sure the password matches to the entered password");
            return res.status(400).json({ error: "Passwords do not match" });
        }


        // create new user
        const newStudent = await new Student({
            ...studentData,
            password: hasedPass
        });

        let courseData;
        if (studentIn === "school") {
          courseData = await SCourses.findOne({});
          console.log(courseData)
        } else if (studentIn === "college") {
          courseData = await CCourses.findOne({});
        }
    
        if (courseData) {
          if (studentIn === "school") {
            const selectedClass = courseData.class.find(
              (schoolClass) => schoolClass.classname === schoolstudent
            );
            if (selectedClass) {
              newStudent.schoolCourse.class = selectedClass._id;
            }
          } else if (studentIn === "college") {
            const selectedCourse = courseData.course.find(
              (collegeCourse) => collegeCourse.coursename === collegestudent
            );
            if (selectedCourse) {
              newStudent.collegeCourse.course = selectedCourse._id;
            }
          }
        }
    
        
        // token generate
        const token = await newStudent.generateAuthToken();
        console.log("the token: " + token);

        // save user or response
        const user = await newStudent.save();
        res.status(200).json(user);
    } catch (e) {
        console.log(e, "erdtyu");
    }
};

exports.login = async(req, res, next)=>{
    try {
        const user = await Student.findOne({email:req.body.email});
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.sendStatus(400).json("wrong password");

        // token generate
        const token = await user.generateAuthToken();
        console.log("the token: " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 10000),
            httponly: true
        });

        res.status(200).json(user);
    } catch (error) {
       console.log(error); 
    }
};

exports.update = async(req, res, next)=>{
    if(req.body._id === req.params.id){
        if(req.body.password){
            try{
                const updatedPassword = await bcrypt.hash(req.body.password, 10);
                req.body.password = updatedPassword;

            } catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await Student.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("Account has been updated");
        }catch(e){
            return res.status(500).json(e);
        }
    } else{
        return res.status(403).json("You can update only you account!");
    }
};
