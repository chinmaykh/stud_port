var mongoose = require('mongoose');

// Teacher Schema
var teacherSchema = mongoose.Schema({
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
	chats:[String]
	,
	notf:[String],
	tt:[{
        day: {type: String} ,
        periods:[String]
    }]
});

const teacher = module.exports = mongoose.model('teacher', teacherSchema, 'teacher');//accessible from anywhere else

// Get teacher list
module.exports.getTeachers = (callback, limit) =>{
	teacher.find(callback).limit(limit);
};

// Get Teacher list by Id ( Use this for all calls)
module.exports.getTeacherById = (id, callback) =>{
	teacher.findById(id, callback);
};

// Pretty wasteful existance
module.exports.getTeacherByUsername = (user, callback) =>{
	teacher.find({username:user}, callback);
};

// Admin or Dev.
module.exports.addTeacher= (tt, callback) =>{
	teacher.create(tt, callback);
};

// Update Teacher ( NOTE )
module.exports.updateTeacher = (id, cred, options, callback) =>{
	var query = {_id: id};
	teacher.findOneAndUpdate(query, update, options, callback);
};


module.exports.removeTeacher = (id, callback) =>{
	var query = {_id: id};
	teacher.remove(query, callback);
};
