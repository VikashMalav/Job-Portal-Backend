const express = require('express');
const dotenv = require('dotenv');
const apiroutes = require('./routes/authRoute');
const cors = require('cors')
const mongoose = require("mongoose");
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const employerRoute = require('./routes/employerRoute');
const adminRoute = require('./routes/adminRoute');
const companyRoute = require('./routes/companyRoute');
const jobRoute = require('./routes/jobRoute');
const applicationRoute = require('./routes/applicationRoute');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;


app.use(cors({
  origin:[process.env.ORIGIN ],
    credentials: true
}));
app.use(cookieParser())
app.use(express.json());
app.use((req, res, next) => {
    const time = new Date().toLocaleString();
    console.log(`[${time}] ${req.method} ${req.url}`)
    next();
})

// app.use('/api', apiroutes);

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/employer', employerRoute);
app.use('/api/admin', adminRoute);
app.use('/api/companies', companyRoute);
app.use('/api/jobs', jobRoute);
app.use('/api', applicationRoute);

app.use(errorHandler)
async function run() {
    try {

        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log('MongoDB connected'))
            .then(() => app.listen(port, () => {
                console.log(`server runnning on ${port}....`)
            }))
            .catch(err => console.error('MongoDB connection error:', err));


    }
    catch (err) {
        console.error("Connection error:", err);
    }
}
run();



