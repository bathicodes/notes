const mongoose = require('mongoose')

mongoose.connect(process.env.DB_HOST,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
},(error) => {
    if (error){
        return console.log(error.message);
    }

    console.log('Database has been connected!');
})