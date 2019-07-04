var mongoose = require('mongoose');

// Student Schema
var studentSchema = mongoose.Schema({
	_id:{
		type:Number
	},
	username:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	email:{
		type:String
	},
	name:{
		type: String,
		required: true
	},
	house:{
		type: String,
		required: true
	},
	grade:{
		type: String,
		required: true
	},
	chats:[String]
	,
	ntf:[
		{
			due:{type:Date},
			msg:{type:String}
		}
	]
});

const student = module.exports = mongoose.model('student', studentSchema, 'student');//accessible from anywhere else

// Get Student
module.exports.getStudents = (callback, limit) =>{
	student.find(callback).limit(limit);
};

// Get Student byID ( All calls to be made here 9 ((unique))
module.exports.getStudentById = (id, callback) =>{
	console.log(id);
	student.findById(id, callback);
};

// Get Student by username
module.exports.getStudentByUsername = (user, callback) =>{
	student.find({username:user}, callback);
};

// Add student
module.exports.addStudent= (tt, callback) =>{
	student.create(tt, callback);
};

// Update student
module.exports.updateStudent = (id, cred, options, callback) =>{
	var query = {_id: id};
	student.findOneAndUpdate(query, cred, options, callback);
};

module.exports.updateStudentByUsername = (user, cred, options, callback) =>{
	var query = {admno: user};
	student.find(query, update, options, callback);
};
/*
module.exports.updateUnread = (user, cred, options, callback) =>{
	var query = {username: user};
	var update = {
		unread:cred
		};
	student.update(query, update, options, callback);
};
*/
/*
module.exports.addToGroups = (user, grade, house, options, callback) =>{
	var query = {username:user};

	student.update(query, {$push:{chats:"Class "+String(grade)}})
	student.update(query, {$push:{chats:String(house)}})
}
*/
module.exports.removeStudent = (id, callback) =>{
	var query = {_id: id};
	student.remove(query, callback);
};


