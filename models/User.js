const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    fullname: {
      required: true,
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      default: "",
      type: String,
      max: 180,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    contact: {
      type: Number,
      default: "",
    },
    age: {
      type: Number,
      default: "",
    },
    inWhat: {
      type: String,
      enum: ["school", "college"],
      required: true,
    },
    schoolstudent: {
      type: String,
      enum: ["6", "7", "8", "9", "10", "11", "12"],
      required: function () {
        return this.in === "school";
      }
    },
    collegestudent: {
      type: String,
      enum: ["Btech", "Bsc"],
      required: function () {
        return this.in === "college";
      }
    },
    socialacc: [
      {
        twitter: {
          type: String,
          default: "",
        },
        insta: {
          type: String,
          default: "",
        },
        linkedin: {
          type: String,
          default: "",
        },
        other: {
          type: String,
          default: "",
        },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

function getRefModel(student) {
  if (student.in === "school") {
    return "schoolcourse"; // Use the ref name for the school course model
  } else if (student.in === "college") {
    return "collegecourse"; // Use the ref name for the college course model
  }
}

studentSchema.add({
  schoolCourse: {
    class: {
      type: Schema.Types.ObjectId,
      ref: "schoolcourse",
      required: function () {
        return (
          this.in === "school" &&
          ["6", "7", "8", "9", "10", "11", "12"].includes(this.schoolstudent)
        );
      },
    },
  },
  collegeCourse: {
    course: {
      type: Schema.Types.ObjectId,
      ref: function (student) {
        return getRefModel(student); // Use the appropriate ref model
      },
      required: function () {
        return (
          this.in === "college" &&
            ["Btech", "Bsc"].includes(this.collegestudent)
        );
      },
    },
  },
});

studentSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token });
    return token;
  } catch (err) {
    console.log("5");
    res.status(502).json("the err part" + err);
  }
};

// const classSchema = new Schema({
//     schoolclasses: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Student",
//         validate: {
//           validator: function (value) {
//             return value.every((student) => student.in === "school");
//           },
//           message: (props) => "All referenced students must be school students.",
//         },
//       },
//     ],
//     collegeclasses: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Student",
//         validate: {
//           validator: function (value) {
//             return value.every((student) => student.in === "college");
//           },
//           message: (props) => "All referenced students must be college students.",
//         },
//       },
//     ],
//   });

const Student = mongoose.model("student", studentSchema);

module.exports = Student;