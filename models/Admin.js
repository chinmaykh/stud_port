var mongoose = require('mongoose');

// Admin Schema
var AdminSchema = mongoose.Schema({
	username:{
		type: String
	},
	password:{
		type: String
	},
	email:{
		type:String
	},
	name:{
		type: String
	}
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema, 'admin');//accessible from anywhere else

// Get Admin list
module.exports.getAdmins = (callback, limit) =>{
	Admin.find(callback).limit(limit);
};

// Get Admin by ID
module.exports.getAdminById = (id, callback) =>{
	Admin.findById(id, callback);
};

// Get Admin by username
module.exports.getAdminByUsername = (user, callback) =>{
	Admin.find({username:user}, callback);
};

// Add new Admin
module.exports.addAdmin= (tt, callback) =>{
	Admin.create(tt, callback);
};

// Update Admin
module.exports.updateAdmin = (id, cred, options, callback) =>{
	var query = {_id: id};
	// NOTE : cred should be in proper format
	Admin.findOneAndUpdate(query, cred, options, callback);
};

// Remove admin ( Only by Admin or Dev. )
module.exports.removeAdmin = (id, callback) =>{
	var query = {_id: id};
	Admin.remove(query, callback);
};

