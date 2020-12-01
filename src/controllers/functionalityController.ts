import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/userModel';
import { Functionality } from "../models/functionalityModel"; 

// For GET request "/functionality/add": Renders the 'add-functionality'-page. No DB call or other function call returning a promise, therefore 
// no "async" specification 
export const addFunctionality = (_req: Request, res: Response) => {
    res.render('add-functionality', { title:'Add node functionality', path: 'add-functionality' });
};

// For POST request "/functionality/add": Creates a functionality with the specified input in the DB 
export const createFunctionality = async (req: Request, res: Response) => {
    let user = req.user as IUser;
    req.body.owner = user._id;

    // Validation
    const foundFuncName = await Functionality.findOne({ name: req.body.name });
    if (foundFuncName) {
        req.flash('error', 'A functionality already exists with that delightful name ⛔');
        return res.redirect('/functionality/add');
    }

    const func = await (new Functionality(req.body)).save();

    // ! Maybe do some rebooting here? Or actually: DO IT when functionality is added to node

    req.flash('success', `Successfully created functionality '${func.name}'.`);
    res.redirect('/functionality');
}; 

// Middleware function to fetch functionalities of a user from DB and appending them to the body, should be 
// called before a 'res.render'-call in order to fetch functionalities 
export const fetchFunctionality = async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const functionalities = await Functionality.find();
  
    // Only get the functionalities that belong to the user
    req.functionalities = functionalities.filter(functionality => functionality.owner.equals(user._id)); 
    next();
};

// For GET request "/functionality": Renders the 'functionality'-page, which shows all the functionalities of a user, which means 
// you should call fetchFunctionality() before getFunctionality()
export const getFunctionality = (req: Request, res: Response) => {
    res.render('functionality', { title: 'Your functionalities', functionalities: req.functionalities });
};

// For GET request "/functionality/:id/edit": Render the page where a functionality can be edited, which should only send the one clicked
// functionality to this page - it finds it by finding its unique mongoDB id 
export const editFunctionality = async (req: Request, res: Response) => {
    const functionality = await Functionality.findOne({ _id: req.params.id });
    if (!functionality) {
        req.flash('error', 'Could not find the functionality you tried to edit ⛔'); 
        return res.redirect('/functionality');
    } else {
        res.render('add-functionality', { title: `Edit ${functionality.name}`, functionality: functionality });
    }
};

// For POST request "/functionality/:id": Edits the specific functionality in the DB 
export const updateFunctionality = async (req: Request, res: Response) => {
    // Validation
    const foundFuncName = await Functionality.findOne({ name: req.body.name });
    if (foundFuncName) {
        if (foundFuncName._id != req.params.id) {
            req.flash('error', 'A functionality already exists with that delightful name ⛔');
            return res.redirect(`/functionality/${req.params.id}/edit`);
        }
    }

    const functionality = await Functionality.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true, // returns the new functionality instead of the old one
      runValidators: true // runs the validators to ensure there is still name etc.
    }).exec();
  
    if (!functionality) {
        req.flash('error', 'Could not find the functionality you tried to update in the database ⛔'); 
        return res.redirect('/functionality');
    } else {
      req.flash('success', `Successfully updated ${functionality.name} 🔥`);
      res.redirect(`/functionality`);
    }
};

// For GET request "functionality/delete/:id": Deletes the specific functionality from the DB
export const deleteFunctionality = async (req: Request, res: Response) => {
    await Functionality.findOneAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            req.flash('error', 'Sorry, something went wrong when trying to delete the functionality!');
            res.redirect('/functionality');
        }
        req.flash('success', `The functionality was deleted! 👋`);
        return res.redirect('/functionality');
    });
};
