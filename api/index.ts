import express from "express";
import * as path from "path";

const app = express();
const port = process.env.PORT || 8000;

// also have this server serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));

// specify the endpoint, so here if you go to localhost:3000/hello it will do whatever
// we do inside here
app.get('/api/hello', (req, res) => { // 2 args, req (user ip, request details (if post
    // give details about the update data)
    res.send('Hello world!')
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

// start the web server (on my computer) with passed in argument
// as port (3000)
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
