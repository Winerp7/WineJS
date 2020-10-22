exports.directSignup = (req, res, next) => {
  res.render('signup', { pageTitle: 'Sign up'});
};

exports.directDashboard = (req, res, next) => {
  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard'});
};

exports.directAddDevice = (req, res, next) => {
  res.render('add-device', { pageTitle: 'Add Device', path: '/add-device'});
};