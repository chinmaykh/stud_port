var mongoose = require('mongoose');

// Class Schema
// Classes are supposed to have student list
// CLasses are supposed to have teacher list
// Classes are supposed have timetables
// Classes are supposed to have notification.
// Lets do all this for now and see 
// TODO: FINISH THIS WORK

var ClassSchema = mongoose.Schema({
	name:{
		type: String
	},
    ntf:[
		{
			due:{type:String},
			msg:{type:String}
		}
	],    
    sl:[String],
    tl:[String],
    tt:[{
        day: {type: String},
        periods:[String]
	}],
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
		}]
});

const Class = module.exports = mongoose.model('Class', ClassSchema, 'class');//accessible from anywhere else

// Get Class list 
module.exports.getClass = (callback, limit) =>{
	Class.find(callback).limit(limit);
};

// Get class by name ( USE THIS FOR ALL SPECIFIC CALLS)
module.exports.getClassByName = (nam, callback) =>{
	console.log(JSON.stringify(nam));
	Class.find({name : nam}, callback);
};

// Create class ( USE THIS FOR CREATING ( HOUSES AND CLUBS ) )
module.exports.addClass= (clas, callback) =>{
	Class.create(clas, callback);
};

// Update Class list or features
module.exports.updateClass = (id, update, options, callback) =>{
	var query = {_id:id};
	console.log("HEllo " + JSON.stringify(update));
	Class.findOneAndUpdate(query, update, options, callback);
};

// Remove class ( Dev. only at this point)
module.exports.removeClass = (id, callback) =>{
	var query = {_id: id};
	Class.remove(query, callback);
};

// Get class messages

module.exports.getClassMessages = (id, callback) =>{
	var query = {name: id};
	Class.find(query);
}

// Add notifications to class

module.exports.addToNtf = (nama, due, ntf, callback) =>{
	var query =  {name : "Class 12A"};
	console.log("Whatsup ?");
	Class.find(query,callback);
	console.log("Did it come here ?");
}

// Add more features here