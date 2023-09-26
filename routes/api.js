const router = require("express").Router();
const apiContoller = require("../controllers/api");

router.post('/api/college', apiContoller.apiCCourse);
router.post('/api/school', apiContoller.apiSCourse);
router.get('/api/getcollege', apiContoller.getCollegeCourses);
router.get('/api/getschool', apiContoller.getSchoolCourses);

module.exports = router;
