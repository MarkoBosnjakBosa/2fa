module.exports = function(app, models) {
    const User = models.User;
    app.get("/getUser/:username", (request, response) => {
        var username = request.params.username;
        var query = {username: username};
        User.findOne(query).then(user => {
            user.password = null;
            response.status(200).json({user: user});
            response.end();
        }).catch(error => console.log(error));
    });
    app.put("/editUser", (request, response) => {
        var allowEdit = true;
        var errorFields = [];
        var username = request.body.username;
        var firstName = request.body.firstName;
        if(!username && !firstName) {
            errorFields.push("firstName");
            allowEdit = false;
        }
        var lastName = request.body.lastName;
        if(!lastName) {
            errorFields.push("lastName");
            allowEdit = false;
        }
        if(allowEdit) {
            var query = {username: username};
            var update = {firstName: firstName, lastName: lastName};
            User.findOneAndUpdate(query, update).then(user => {
                response.status(200).json({edited: true});
                response.end();
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({edited: false, errorFields: errorFields});
            response.end();
        }
    });
}