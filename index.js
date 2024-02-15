require('dotenv').config()
const express = require("express")
const app = express();
const port = 8000;
const jwt = require("jsonwebtoken");
const { Admin } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const url = process.env.MONGO_DB
app.use(express.json());
app.use(cors());

const secret = process.env.SECRET
mongoose.connect(url);

const adminAutentication = (req, res, next) => {

    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];


    jwt.verify(token, secret, (err, decoded) => {
        try {
            req.user = decoded.username;
            next()
        } catch (err) {
            console.log(err);
        }
    })

}

const userAuthentication = (req, res, next) => {
    const authorization = req.headers.Authorization;

    const token = authorization.split(" ")[1];

    jwt.verify(token, secret, (err, decoded) => {
        try {
            req.user = decoded.username;
            next()
        } catch (err) {
            console.log(err);
        }
    })
}


/**
 * * SCHEMAS
 */


const adminSchema = mongoose.Schema({
    username: String,
    password: String
})

const courseSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String
})

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'COURSES' }]
})


const USERS = mongoose.model('Users', userSchema);
const ADMIN = mongoose.model('Admin', adminSchema);
const COURSES = mongoose.model('COURSES', courseSchema);


app.get("/", (req, res) => {
    res.send("Hello")
})


/**
 * * ADMIN ROUTES GOES HERE
 */

app.get("/admin/courses", adminAutentication, async (req, res) => {
    const courses = await COURSES.find();
    if (courses) {
        res.status(200).json({
            course: courses
        });
    } else {
        res.status(403).json({ message: "No Course Available" });
    }
})

app.post("/admin/signup", async (req, res) => {
    const { username, password } = req.body;

    const exists = await ADMIN.findOne({ username });

    if (exists) {
        res.status(403).send("Admin Already Exists");
    } else {
        const newAdmin = new ADMIN({
            username: username,
            password: password
        });

        await newAdmin.save();
        const token = jwt.sign({ username: username, role: 'Admin' }, secret, {
            expiresIn: 60 * 60
        });

        res.status(200).json({
            message: "Admin Created Successfully",
            token: token
        })
    }
})

app.post("/admin/login", async (req, res) => {

    const { username, password } = req.body;
    const exists = await ADMIN.findOne({ username: username, password: password });


    if (exists) {
        const token = jwt.sign({ username: username, role: 'Admin' }, secret, {
            expiresIn: 60 * 60
        })

        res.status(200).json({
            message: "Logged In Successfully",
            token: token
        });

    } else {
        res.status(400).json({
            message: "Invalid Credentials"
        })
    }


})


app.post("/admin/courses", adminAutentication, async (req, res) => {

    const course = new COURSES(req.body);
    await course.save();
    res.status(200).send(`Course ${req.body.title} Created Successfully`);

})

app.put('/admin/courses/:id', adminAutentication, async (req, res) => {

    const id = req.params.id

    const course = await COURSES.findByIdAndUpdate(id, req.body);

    if (course) {
        res.status(200).send("Course has been updated Successfully");
    } else {
        res.status(403).send("No Course Exist");
    }
})

/**
 * * USER ROUTES GOES HERE ->
 */

app.post("/users/signup", async (req, res) => {

    const { username, password } = req.body;


    const exists = await USERS.findOne({ username });


    if (exists) {
        res.status(403).send("User Already Exist");
    } else {

        const newUser = new USERS(
            {
                username,
                password
            }
        )

        await newUser.save();

        const token = jwt.sign({ username, role: "User" }, secret, { expiresIn: "1h" });

        res.status(200).json({
            message: "User Created Successfully",
            token: token
        });

    }

})


app.post("/users/login", async (req, res) => {

    const { username, password } = req.body;
    const user = await USERS.findOne({ username, password });
    if (user) {
        const token = jwt.sign({ username, role: "User" }, secret, { expiresIn: "1h" });
        res.status(200).json({
            message: "User Logged",
            token: token
        })
    } else {
        res.send("Invalid Credentials");
    }
})

app.get("/users/courses", userAuthentication, async (req, res) => {

    const course = await COURSES.find();

    res.status(200).json(course);

})


app.post("/users/courses/:courseId", userAuthentication, async (req, res) => {

    const id = req.params.courseId;
    const course = await COURSES.findById(id);
    if (course) {

        const user = await USERS.findOne({ username: req.user });
        user.purchasedCourses.push(course);

        await user.save();

        res.status(200).send("Course Purchased Successfully");

    } else {

        res.status(404).json({ message: "Course Not Found or Invalid Id" })

    }

})

app.get("/users/purchasedCourses", userAuthentication, async (req, res) => {

    const purchasedCourses = await USERS.findOne({ username: req.user }).populate('purchasedCourses');

    if (purchasedCourses) {
        res.status(200).json({
            purchasedCourses: purchasedCourses.purchasedCourses || []
        })
    } else {
        res.send("User not Found");
    }


})



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})