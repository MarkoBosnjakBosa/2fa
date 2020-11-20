module.exports = function(mongoose) {
	const userScheme = new mongoose.Schema({
		username: String,
		email: String,
		password: String,
		firstName: String,
		lastName: String,
		accepted: Boolean,
		acceptanceToken: String,
		authentication: Object
	}, {minimize: false});
	const models = {
		User: mongoose.model("User", userScheme)
	}
	return models;
}