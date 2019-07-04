// SCSCSCSCSCSC NPSRNR STUDENT PORTAL 

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Connect to Mongoose

var url = 'mongodb://localhost/SP'

mongoose.connect(url, {
	useMongoClient: true
});

var conn = mongoose.connection;
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var fileupload = require("express-fileupload");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

app.use(express.static(__dirname + '/Front_end'));		//static public directory to be used
app.use(bodyParser.json());
app.use(fileupload());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(req.body);
	next();
});

// initialise bodyParser
Admin = require('./models/Admin');
Room = require('./models/rooms');
// Removed Student timetables as its successully integrated into CLass
Class = require('./models/class');
Student = require('./models/students');
Teacher = require('./models/teacher');
// Removed Teacher Timetable as successfully integrated into Teacher
Group = require('./models/groups');
// Removed reminders as successfully integrated into student, class and teacher reminders as notification
Substitution = require('./models/substitutions');
// Removed feedback as mail is directly sent 
// Removed files as mongo file stream usage



conn.once('open', function () {
	var gfs = Grid(conn.db);
	// all set!


	app.get('/', function (req, res) {
		res.send('Use /api/timetables');
	});


	//--------------------------------------------------DEV-------------------------------------------------------------------------------------
	//-----------------------------MAIL OPTIONS-----------



	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'svnpsrnr@gmail.com',
			pass: 'chinmaykh'
		}
	});


	// FILE UPLOADS
	function cmon(req, res) {
		console.log(req.body.usrnam)
		var part = req.files.file;
		var writeStream = gfs.createWriteStream({
			filename: part.name,
			mode: 'w',
			content_type: part.mimetype,
			metadata: {
				"usrnam": req.body.usrnam,
				"org": req.body.org
			}
		});
		writeStream.on('close', function (response) {
			return res.status(200).send({
				message: 'Success',
				fileUploadId: response._id
			});
		});
		writeStream.write(part.data);
		writeStream.end();
	}

    // FILE DOWNLOAD GATEWAY
	function getFiles(req, res) {

		var readstream = gfs.createReadStream({
			_id: req
		});
		console.log('It was found, I think')
		readstream.pipe(res);

	}

    // FILE QUERY PATHWAY

	function findFiles(req, res, pram) {

		// console.log("filename to download "+req.params);
		console.log(pram);
		gfs.files.find({ filename: pram }).toArray(function (err, files) {
			if (err) {
				return res.status(400).send(err);
			}
			else if (!files.length === 0) {
				return res.status(400).send({
					message: 'File not found'
				});
			}
			console.log(files);

			res.json(files);
		});


	}

    // FILE UPLOAD URL
	app.post('/upload', (req, res) => {
		req.files.file.name = req.body.class;
		console.log(req);
		cmon(req, res);
	});

    // FILE DOWNLOAD URL
	app.get('/files/:id', (req, res) => {
		console.log(req.params.id);
		getFiles(req.params.id, res);

	});

    // FILE QUERY URL
	app.post('/findMyFiles/', (req, res) => {
		var param = req.body.param;
		console.log(param);
		findFiles(req, res, param);
	});

	//----- Feedback -----
	app.get('/chin/feedbacks', (req, res) => {
		Feedbak.getFeedBacks((err, fdb) => {
			if (err) { throw err; }
			res.json(fdb);
		});
	});

	app.post('/chin/feedbacks', (req, res) => {
		var fbbbb = req.body;

		var mailOptions = {
			from: 'svnpsrnr@gmail.com',
			to: ['chinmayharitas@gmail.com','kiranbodipati@gmail.com'],
			subject: 'Feedback !',
			text: JSON.stringify(fbbbb)
		};

		transporter.sendMail(mailOptions, function (error, info) {

			if (error) {
				console.log(error);
				console.log("Check for security permission from google");
			} else {
				console.log('Email sent: ' + info.response);
			}
		});


		Feedbak.sendFeedBack(fbbbb, (err, fbbbb) => {
			if (err) { throw err; }
			res.json('Feedback has been sent to developer');
		});


	});


	//--------------------------------------------------Admin--------------------------------------------------------------------------------------

	app.get('/list/Admins', (req, res) => {

		Admin.getAdmins((err, creds) => {
			if (err) {
				throw err;
			}
			res.json(creds);
		});
	});

	app.get('/ravi',(req,res)=>{
		res.send('HI ravi');
	});

	app.post('/validate/admin', (req, res) => {
		usr = req.body.usr;
		pass = req.body.pass;
		var query = {
			"username": usr,
			"password": pass
		}
		console.log('Admin validation');
		Admin.chkusrnam(query, (err, result) => {
			if (err) {
                throw err;
                Console.log('Invalid !!!!!')
				res.send('Invalid !!!!!');
			} else {
                Console.log('Success !!')                
				res.json(result);
			}
		});
	});

	app.get('/list/admin', (req, res) => {
		Admin.find(function (err, result) {
			if (err) { throw err; }
			res.json(result);
		});
	});

	app.get('/api/admins', (req, res) => {
		Admin.getAdminById(req.params._id, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	app.post('/add/admin', (req, res) => {
		var cred = req.body;
		Admin.addAdmin(cred, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json("Successfully added");
		})
	});

	app.post('/update/admin', (req, res) => {
        var id = req.body._id;
        var cred = req.body.cred;
		Admin.updateAdmin(id, cred, {}, (err, sult) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(sult);
		})
	});

	//-------------------------------------------------Class----------------------------

	app.get('/list/class', (req, res) => {
		Class.getClass((err, creds) => {
			if (err) {
				throw err;
			}
			res.json(creds);
		});
	});

	// The most important call for all class info
	app.get('/api/class/:name', (req, res) => {
		Class.getClassByName(req.params.name, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			console.log(cred);
			res.json(cred);
		})
	});

	app.get('/api/class/messages/:name',(req,res)=>{
		Class.getClassMessages(req.param.id,(err,cred)=>{
			if(err){
				throw err;
			}
			console.log(cred.message)
			res.json(cred.messages);
		})
	})

	app.post('/add/class', (req, res) => {
		var cred = req.body;
		Class.addClass(cred, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json("Class has been added - Regards Chin");
		})
	});

	app.get('/api/class/timetable/:name',(req,res)=>{
		Class.getClassByName(req.params.name, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			console.log("This " + cred[0].tt);
			res.json(cred[0].tt);
		})
	})

	app.post('/api/class/setRem',(req,res)=>{
		Class.addToNtf(req.body.name, req.body.due ,req.body.msg, (err,ret) =>{
			if (err) {
				throw err;
			}
			
			ret[0].ntf.push({
				due:req.body.due,
				msg:req.body.msg
			});

			console.log(ret[0].ntf);
			// Update the Class Object now
			Class.updateClass(ret[0]._id, ret[0], {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
				if (err) {
					throw err;
				}
				res.json(cred);
			})

		})
	});

	app.post('/api/class', (req, res) => {
		var id = req.body._id;
		var tt = req.body;
		console.log("This " +JSON.stringify(tt));
		Class.updateClass(id, tt, {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});



	//--------------------------------------------------ROOMS--------------------------------------------------------------------------------------

	app.get('/rooms', (req, res) => {
		Room.getRooms((err, rooms) => {
			if (err) {
				throw err;
			}
			res.json(rooms);
		});

	});


	app.get('/rooms/:_id', (req, res) => {
		Room.getRoomById(req.params._id, (err, room) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(room);
		})
	});

	app.post('/sc', (req, res) => {
		var theroom = req.body;
		var obj =
			{
				"name": req.body.name,
				"date": req.body.date,
				"period": req.body.period
			}
		Room.check_availibilty(obj, (err, reply) => {
			if (err) { throw err; }

			if (reply[0] == undefined) {
				console.log("No such booking has been found");
				Room.addRoom(theroom, (err, hman) => {
					if (err) { throw err; }
					res.json('Room has been booked');
				});
			} else if (reply[0] != undefined) {
				console.log('Booking has been found');
				console.log(reply[0].authority);
				res.json("Sorry, room has already been booked by " + reply[0].authority);
			}
		});
	});


	app.post('/sc/findbyauth', (req, res) => {
		Room.getRoomsByAuthority(req.body, (err, details) => {
			console.log("sc");
			res.json(details);
		});

	});

	app.post('/sc/removeRoom', (req, res) => {
		Room.removeRoom(req.body, (err, det) => {
			if (err) { throw err; }
		});
		res.json("Booking has been succesfully cancelled.");

	});



	app.post('/rooms', (req, res) => {
		var room = req.body;
		Room.addRoom(room, (err, room) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(room);
		})
	});

	// Missallaneous(idk the spelling) request call with sny paramter of the room
	app.post('/rooms/withQuery', (req, res) => {
		var param = req.body;
		Room.getRoomsByParams(param, (err, room) => {
			if (err) { throw err; }
			res.json(room);
			console.log(room);
		});
	});


	//--------------------------------------------------STUDENTS--------------------------------------------------------------------------------------

	app.get('/list/students', (req, res) => {
		Student.getStudents((err, creds) => {
			if (err) {
				throw err;
			}
			res.json(creds);
		});
	});

	// The most important call for all student info
	app.get('/api/students/:_id', (req, res) => {
		console.log(req.params._id);
		Student.getStudentById(req.params._id, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			console.log(cred);
			res.json(cred);
		})
	});

	app.post('/add/student', (req, res) => {
		var cred = req.body;
		Student.addStudent(cred, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json("Student has been added - Regards Chin");
		})
	});

	app.post('/api/students', (req, res) => {
		var id = req.body._id;
		var tt = req.body;
		Student.updateStudent(id, tt, {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});


	//--------------------------------------------------TEACHERS--------------------------------------------------------------------------------------

	app.get('/list/teacher', (req, res) => {
		Teacher.getTeachers((err, creds) => {
			if (err) {
				throw err;
			}
			res.json(creds);
		});
	});

	app.get('/api/teachers/:_id', (req, res) => {
		Teacher.getTeacherById(req.params._id, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});


	app.post('/add/teachers', (req, res) => {
		var cred = req.body;
		Teacher.addTeacher(cred, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	app.post('/api/teachers/:_id', (req, res) => {
		var id = req.body._id;
		var tt = req.body.tt;
		Teacher.updateTeacher(id, tt, {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});


	
	//--------------------------------------------------GROUPS--------------------------------------------------------------------------------------

	app.get('/list/groups', (req, res) => {
		Group.getGroups((err, creds) => {
			if (err) {
				throw err;
			}
			res.json(creds);
		});
	});

	app.get('/api/groups/:_id', (req, res) => {
		Group.getGroupById(req.params._id, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	app.get('/groups/:name', (req, res) => {
		Group.getGroupByName(req.params.name, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	app.post('/add/groups', (req, res) => {
		var cred = req.body;
		Group.addGroup(cred, (err, cred) => {				 	//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	app.post('/api/groups/:_id', (req, res) => {
		var id = req.body._id;
		var tt = req.body.tt;
		Group.updateGroup(id, tt, {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});


	app.put('/groups/:name', (req, res) => {
		var name = req.params.name;
		var tt = req.body;
		Group.addMessage(name, tt, {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	app.put('/groups/links/:name', (req, res) => {
		var name = req.params.name;
		var tt = req.body;
		Group.addLink(name, tt, {}, (err, cred) => {					//BASICALLY A LOOP, IF NO MATCH, ERR
			if (err) {
				throw err;
			}
			res.json(cred);
		})
	});

	//--------------------------------------------------SOCKET.IO--FOR-MESSAGING------------------
	var a  = 0 ;
	io.on('connection',(socket)=>{
		a = a+1;
		console.log( a + 'User(s) Connected ! ');
		socket.on('disconnect', function(){
			console.log('User disconnected');
		});
	})

	//--------------------------------------------------SERVER--------------------------------------------------------------------------------------

	app.listen(8989);
	console.log('Running on port 8989...');

})