module.exports = function(app, bcryptjs, models) {
	const User = models.User;
	app.post("/createUser", (request, response) => {
		var allowRegistration = true;
		var errorFields = [];
		var username = request.body.username;
		if(!username || invalidUsername(username)) {
			errorFields.push("username");
			allowRegistration = false;
		}
		var email = request.body.email;
		if(!email || invalidEmail(email)) {
			errorFields.push("email");
			allowRegistration = false;
		}
		var password = request.body.password;
		if(!password || invalidPassword(password)) {
			errorFields.push("password");
			allowRegistration = false;
		}
		var firstName = request.body.firstName;
		if(!firstName) {
			errorFields.push("firstName");
			allowRegistration = false;
		}
		var lastName = request.body.lastName;
		if(!lastName) {
			errorFields.push("lastName");
			allowRegistration = false;
		}
		if(allowRegistration) {
			var query = {$or: [{username: username}, {email: email}]};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					var error = {created: false, alreadyExists: true};
					if(user.username == username) {
						error.field = "username";
					} else {
						error.field = "email";
					}
					response.status(200).json(error);
					response.end();
				} else {
					var accepted = false;
					var authentication = {};
					var newUser = getUserScheme(User, username, email, password, firstName, lastName, accepted, authentication);
					bcryptjs.genSalt(10, (error, salt) => {
						bcryptjs.hash(newUser.password, salt, (error, hash) => {
							newUser.password = hash;
							newUser.save().then(user => {
								//sendConfirmationEmail(user.username, user.email, user.firstName);
								response.status(200).json({created: true});
								response.end();
							}).catch(error => console.log(error));
						});
					});
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields});
			response.end();
		}
	});

	function getUserScheme(User, username, email, password, firstName, lastName, accepted, authentication) {
		return new User({username: username, email: email, password: password, firstName: firstName, lastName: lastName, accepted: accepted, authentication: authentication});
	}
	function invalidUsername(username) {
		var usernameFormat = /^[a-z0-9_.-]*$/;
		if(usernameFormat.test(username)) {
			return false;
		} else {
			return true;
		}
	}
	function invalidEmail(email) {
		var emailFormat = /\S+@\S+\.\S+/;
		if(emailFormat.test(email)) {
			return false;
		} else {
			return true;
		}
	}
	function invalidPassword(password) {
		var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if(passwordFormat.test(password)) {
			return false;
		} else {
			return true;
		}
	}
	function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
	}
}