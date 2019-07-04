var mongoose = require('mongoose');

// Group Schema
var GroupSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	messages:[
		{
			entry:{
				type:String
			},
			user:{
				type:String
			},
			create_date:{
				type: Date,
				default: Date.now()
			}
		}],
	links:[
		{
			entry:{
				type:String
			},
			user_id:{
				type:String
			},
			create_date:{
				type: Date,
				default: Date.now()
			}
		}]

});

const Group = module.exports = mongoose.model('Group', GroupSchema, 'groups');//accessible from anywhere else

// Get Groups
module.exports.getGroups = (callback, limit) =>{
	Group.find(callback).limit(limit);
};

// Get groups by ID
module.exports.getGroupById = (id, callback) =>{
	Group.findById(id, callback);
};

// Get groups by Name 
module.exports.getGroupByName = (name, callback) =>{
	Group.find({name:name}, callback);
}

// Add a group
module.exports.addGroup= (tt, callback) =>{
	Group.create(tt, callback);
};

// Update a group 
module.exports.updateGroup = (id, cred, options, callback) =>{
	var query = {_id: id};
	// NOTE: cred needs to be in proper format
	Group.findOneAndUpdate(query, cred, options, callback);
};

// Add a message
module.exports.addMessage = (xyz, grp, options, callback) =>{	
	Group.update({name:xyz},{$push:{messages:{entry:grp.entry, user:grp.user}}}, options, callback)
}

// Add a link
module.exports.addLink = (xyz, grp, options, callback) =>{
		Group.update({name:xyz},{$push:{links:{entry:grp.entry, user:grp.user}}}, options, callback)
}

// Remove a group ( Temp things likegrp discussions and all )
module.exports.removeGroup = (id, callback) =>{
	var query = {_id: id};
	Group.remove(query, callback);
};


