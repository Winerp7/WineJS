exports.landingpage = (req, res, next) => {
  res.render('landingpage', { title: 'Our dope ass app', path: '/' });
};