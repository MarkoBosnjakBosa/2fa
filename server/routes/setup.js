module.exports = function(app, speakeasy, qrCode, models) {
    const User = models.User;
    app.get("/getAuthentication/:username", (request, response) => {
        var username = request.params.username;
        var query = {username: username};
        User.findOne(query).then(user => {
            if(!isEmpty(user)) {
                if(user.authentication.secret) {
                    response.status(200).json({authenticated: true, authentication: user.authentication});
                    response.end();
                } else {
                    response.status(200).json({authenticated: false});
                    response.end();
                }
            } else {
                response.status(200).json({authenticated: false});
                response.end();
            }
        }).catch(error => console.log(error));
    });
    app.put("/enableAuthentication", (request, response) => {
        var username = request.body.username;
        const secret = speakeasy.generateSecret({length: 10});
        qrCode.toDataURL(secret.otpauth_url, (error, dataUrl) => {
            var query = {username: username};
            var update = {authentication: {secret: "", tempSecret: secret.base32, dataURL: dataUrl, otpURL: secret.otpauth_url}};
            User.findOneAndUpdate(query, update, {new: true}).then(user => {
                if(!isEmpty(user)) {
                    response.status(200).json({authenticated: true, authentication: {tempSecret: secret.base32, dataURL: dataUrl, otpURL: secret.otpauth_url}});
                    response.end();
                } else {
                    response.status(200).json({authenticated: false});
                    response.end();
                }
            }).catch(error => console.log(error));
        });
    });
    app.put("/verifyAuthentication", (request, response) => {
        var username = request.body.username;
        var query = {username: username};
        User.findOne(query).then(user => {
            if(!isEmpty(user)) {
                var otpToken = request.body.otpToken;
                var verified = speakeasy.totp.verify({
                    secret: user.authentication.tempSecret,
                    encoding: "base32",
                    token: otpToken
                });
                if(verified) {
                    var update = {$set: {"authentication.secret": user.authentication.tempSecret, "authentication.tempSecret": ""}};
                    User.findOneAndUpdate(query, update, {new: true}).then(verifiedUser => {
                        response.status(200).json({verified: true});
                        response.end();
                    }).catch(error => console.log(error));
                } else {
                    response.status(200).json({verified: false});
                    response.end();
                }
            }
        }).catch(error => console.log(error));
    });
    app.put("/disableAuthentication", (request, response) => {
        var username = request.body.username;
        var query = {username: username};
        var update = {authentication: {}};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            if(!isEmpty(user)) {
                response.status(200).json({disabled: true});
                response.end();
            } else {
                response.status(200).json({disabled: false});
                response.end();
            }
        }).catch(error => console.log(error));
    })

    function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
	}
}