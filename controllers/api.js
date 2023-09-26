const {CCourses, SCourses} = require("../models/Courses");

exports.apiCCourse = async (req,res, next) => {
    try{
        const newCCourse = new CCourses(req.body)
        console.log(req.body);
        const insertCourse = await newCCourse.save();
        res.status(201).send(insertCourse);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.apiSCourse = async (req,res, next) => {
    try{
        const newSCourse = new SCourses(req.body)
        console.log(req.body);
        const insertCourse = await newSCourse.save();
        res.status(201).send(insertCourse);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.getCollegeCourses = async (req, res, next) => {
    try {
      const collegeCourses = await CCourses.find();
      const formattedCourses = collegeCourses[0].course.map((course) => ({
        coursename: course.coursename,
        subjects: course.subjects,
      }));
      res.status(200).json(formattedCourses);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
};
  
  exports.getSchoolCourses = async (req, res, next) => {
    try {
      const schoolCourses = await SCourses.find();
      const formattedCourses = schoolCourses[0].class.map((schoolClass) => ({
        classname: schoolClass.classname,
        subjects: schoolClass.subjects,
      }));
      res.status(200).json(formattedCourses);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
};