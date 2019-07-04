var mongoose = require('mongoose');

// Substitution Schema
var SubstitutionSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	substitution_list:[{
		classroom:{
			type:String
		},
		period:{
			type:Number
		},
		subst_date:{
			type:Date
		},
		description:{
			type:String
		}

	}]
});

const Substitution = module.exports = mongoose.model('Substitution', SubstitutionSchema, 'substitutions');//accessible from anywhere else

module.exports.getSubstitutions = (callback, limit) =>{
	Substitution.find(callback).limit(limit);
};

module.exports.getSubstitutionById = (id, callback) =>{
	Substitution.find({substitution_list:{$elemMatch:{_id:id}}},{_id:0,username:1,substitution_list:{$elemMatch:{_id:id}}}, callback);
};

module.exports.getSubstitutionByName = (name, callback) =>{
	Substitution.find({username:name}, callback);
}

module.exports.addUser = (username,callback) =>{
	Substitution.create({username:username,substitution_list:[]});
}

module.exports.addSubstitution= (tt, callback) =>{
	Substitution.update({username:tt.username},{$push:{substitution_list:{classroom:tt.classroom,period:tt.period,subst_date:tt.subst_date,description:tt.description}}}, callback);
};

module.exports.removeSubstitution = (id, callback) =>{
	
	Substitution.update({substitution_list:{$elemMatch:{_id:id}}},{$pull:{substitution_list:{_id:id}}}, callback);
};


module.exports.updateSubstitution= (rem,options, callback) =>{
	var update = {
		_id:rem._id,
		classroom:rem.classroom,
		description:rem.description,
		subst_date:rem.subst_date,
		period:rem.period
	}
	Substitution.update({substitution_list:{$elemMatch:{_id:rem._id}}},{$set:{"substitution_list.$":update}},options, callback);
};

