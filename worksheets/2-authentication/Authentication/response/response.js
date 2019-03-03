/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 2
 *	Questions: All
 *	Type: Response"
 ***/

/* Code: 200 - Access Granted */
exports.responseOkWithData = (res, message, data) => {
	res.status(200).json({
		"status": "Ok",
		"message": message,
		"data": data
	});
};

/* Code: 401 - Unauthorised */
exports.responseUnauthorised = (res, message) => {
	res.status(401).json({
		"status": "Unauthorised.",
		"message": message
	});
};

/* Code: 404 - Not Found */
exports.responseNotFound = (res, message) => {
	res.status(404).json({
		"status": "Not Found",
		"message": message
	});
};

/* Code: 500 - Error (Code) */
exports.responseDefaultError = (res) => {
	res.status(500).json({
		"status": "Error",
		"message": "An error has occured, please try again."
	});
};