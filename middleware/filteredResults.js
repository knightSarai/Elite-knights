const filteredResults = (model, populate) => async (req, res, next) => {
	let query;

	const reqQuery = { ...req.query };

	// Fields to execlude, to use them not to treat them as search fields
	const removeFields = [ 'select', 'sort', 'page', 'limit' ];

	// loop over remove Fields an delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// create query string
	let queryStr = JSON.stringify(reqQuery);
	// create operator like ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
	// Finding resource
	query = model.find(JSON.parse(queryStr));

	//select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// sort
	if (req.query.sort) {
		const sortby = req.query.sort.split(',').join(' ');
		query = query.sort(sortby);
	} else {
		query = query.sort('-createdAt');
	}
	//Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}
	// Executing the query
	const filteredResults = await query;

	// Pagination result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		};
	}

	res.filteredResults = {
		success: true,
		count: filteredResults.length,
		pagination,
		data: filteredResults
	};
	next();
};

module.exports = filteredResults;
