import { Request, Response, NextFunction } from 'express';

const validateName = (req: Request, _res: Response) => {
  req.checkBody('name', 'Do you not have a name? 🙂').notEmpty();
  return;
};

const validateEmail = (req: Request, _res: Response) => {
  // @ts-ignore
  req.checkBody('email', 'You must supply an email 💌 ').notEmpty().isEmail().equals(req.user.email);
  req.checkBody('newEmail', 'You must supply a new email 💌 ').notEmpty().isEmail();
  req.sanitizeBody('newEmail').normalizeEmail({
    gmail_remove_dots: false
  });
  return;
};

const validatePassword = (req: Request, _res: Response) => {
  req.checkBody('password', 'Password Cannot be Blank').notEmpty();
  req.checkBody('newPasswordOne', 'Confirmed Password Cannot be Blank').notEmpty();
  req.checkBody('newPasswordTwo', 'Confirmed Password Cannot be Blank').notEmpty();
  req.checkBody('newPasswordOne', 'Woops! Your password do not match').equals(req.body.newPasswordTwo);
  return;
};

// Will contain an array of the errors from the validation/sanitization fns
// valName, valEmail, valPassword
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map((err: any) => err.msg));
    res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
};

export const validateSettings = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/settings/name') {
    validateName(req, res);
  }

  if (req.path === '/settings/email') {
    validateEmail(req, res);
  }

  if (req.path === '/settings/password') {
    validatePassword(req, res);
  }

  handleValidationErrors(req, res);
  next(); // No errors, proceed to userController.updateSettings
};

