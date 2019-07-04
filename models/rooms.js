var mongoose = require('mongoose');

// Tt Schema
var roomSchema = mongoose.Schema({

	
	name:{
		type: String,
		required: false
	},
	authority:{
		type:String,
		required:false
	},
	
	date:{
			type: String,
			required: false
	},
	
	period:{
			type: Number,
			required: false
	}
	

});

const Room = module.exports = mongoose.model('Room', roomSchema, 'rooms');//accessible from anywhere else
// Get Books
module.exports.getRooms = (callback, limit) =>{
	Room.find(callback).limit(limit);
};

module.exports.getRoomById = (id, callback) =>{
	Room.findById(id, callback);
};

module.exports.addRoom= (tt, callback) =>{
	console.log('came to add rooms');
	Room.create(tt, callback);
};

module.exports.addTheRoom = (moor,callback)=>{
	Room.create(moor,callback);

};

module.exports.updateRoom = (id, day,period, options, callback) =>{
	var query = {_id: id};
	var update = {		
		day:day
		};
	Room.findOneAndUpdate(query, update, options, callback);
};

module.exports.removeRoom = (room_params, callback) =>{
		Room.remove(room_params, callback);
};



module.exports.check_availibilty = (obj,callback)=>{
	
	Room.find( obj, callback );
	console.log('sc came to check_availibilty');
	
};

module.exports.getRoomsByAuthority = (auth, callback) =>{
	console.log(auth);
	Room.find(auth,callback);
	console.log("sc came to finding by authority");
};

module.exports.getRoomsByParams = (param,callback)=>{
	console.log(param);
	Room.find(param, callback)
	console.log("Searching for bookings");

};



