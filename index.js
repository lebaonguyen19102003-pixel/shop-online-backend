const express = require("express");
var path = require('path');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const multer = require("multer");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

const Chat = require("./models/chat.model");

_io.on('connection', (socket) => {
  // CLIENT_SEND_MESSAGE
  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    // Lưu vào database
    const chat = new Chat({
      user_id: data.userId,
      content: data.content
    });
    await chat.save();

    // SERVER_RETURN_MESSAGE
    _io.emit("SERVER_RETURN_MESSAGE", data);
    // End SERVER_RETURN_MESSAGE
  });
  // End CLIENT_SEND_MESSAGE

  // CLIENT_SEND_TYPING
  socket.on("CLIENT_SEND_TYPING", async (data) => {
    console.log(data);
    socket.broadcast.emit("SERVER_RETURN_TYPING", data);
  });
  // End CLIENT_SEND_TYPING
});
// End SocketIO

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// flash
app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat', // Nên thêm secret vào đây
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());
// End flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Routes
routeAdmin(app);
route(app);
app.use((req, res, next) => {
  res.status(404).render("client/pages/errors/404", {
    titlePage: "404 Not Found"
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});