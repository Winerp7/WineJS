import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/userModel';
import { Node} from "../models/nodeModel";
import { Functionality } from "../models/functionalityModel"; 

// For GET request "/functionality/add": Renders the 'add-functionality'-page. No DB call or other function call returning a promise, therefore 
// no "async" specification 
export const addFunctionality = (_req: Request, res: Response) => {
    res.render('add-functionality', { title:'Add node functionality', path: 'add-functionality' });
};

// For POST request "/functionality/add": Creates a functionality with the specified input in the DB 
export const createFunctionality = async (req: Request, res: Response) => {
    let user = req.user as IUser;
    const functionalities = await Functionality.find();
    // Only get the functionalities that belong to the user
    req.functionalities = functionalities.filter(functionality => functionality.owner.equals(user._id));
    req.body.owner = user._id;

    // Validation: Check if a functionality already exists with that name by adding the names to an array,
    // and checking if the req.body.name is in this array
    const functionalityNames: string[] = []
    req.functionalities.forEach(fn => functionalityNames.push(fn.name));

    if (functionalityNames.includes(req.body.name)) {
        req.flash('error', 'A functionality already exists with that delightful name ⛔');
        return res.redirect('/functionality/add');
    }

    // Deactivated is a reserved keyword for a "null" functionality, when the nodes are deactivated
    if (req.body.name.toLowerCase() === 'deactivated') {
        req.flash('error', '"Deactivated" is a reserved keyword, and cannot be used ⛔');
        return res.redirect('/functionality/add'); 
    }

    // Gets all the sensor names in the functionality loop code
    req.body.sensors = getSensorNames(req.body.loop)

    const func = await (new Functionality(req.body)).save();

    req.flash('success', `Successfully created functionality '${func.name}' 🔥`);
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
    const user = req.user as IUser;

    // Validation
    const foundFuncName = await Functionality.findOne({ name: req.body.name, owner: user._id});
    if (foundFuncName) {

        if (foundFuncName._id != req.params.id) {
            req.flash('error', 'A functionality already exists with that delightful name ⛔');
            return res.redirect(`/functionality/${req.params.id}/edit`);
        }
    }

    // Gets all the sensor names in the functionality loop code
    req.body.sensors = getSensorNames(req.body.loop)

    const functionality = await Functionality.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true, // returns the new functionality instead of the old one
      runValidators: true // runs the validators to ensure there is still name etc.
    }).exec();
  
    if (!functionality) {
        req.flash('error', 'Could not find the functionality you tried to update in the database ⛔'); 
        return res.redirect('/functionality');
    } else {
      // Find all nodes with this functionality and changes their status to 'pending'
      await Node.updateMany({owner: user._id, function: req.params.id}, {updateStatus: 'Pending'});

      req.flash('success', `Successfully updated ${functionality.name} 🔥`);
      res.redirect(`/functionality`);
    }
};

// For GET request "functionality/delete/:id": Deletes the specific functionality from the DB
export const deleteFunctionality = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    await Functionality.findOneAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            req.flash('error', 'Sorry, something went wrong when trying to delete the functionality ⛔ ');
            res.redirect('/functionality');
        }  
    });

    // Find nodes with the functinality and update their status to 'Pending'
    await Node.updateMany({owner: user._id, function: req.params.id}, {updateStatus: 'Pending', function: null}, function (err) {
        if (err) {
            req.flash('error', 'Sorry, something went wrong when trying to delete the functionality from your nodes ⛔');
            res.redirect('/functionality');
        }

        req.flash('success', `The functionality was deleted! 👋`);
        return res.redirect('/functionality');
    });
};


function getSensorNames(inputString: string){
    function findMatches(regex: RegExp, str: string, matches: string[] = []) {
        const res = regex.exec(str);
        res && matches.push(res[1]) && findMatches(regex, str, matches);
        return matches;
    }
    let find_upload_regex = new RegExp("upload[(]{[^{}]+}[)]", "g");
    let extract_key_regex = new RegExp("[\"']([^\"']+)[\"']( )*:", "g");

    let json = find_upload_regex.exec(inputString);
    if(!json) return [] // If no upload function then there is no sensors

    let matches = findMatches(extract_key_regex, json[0]);
    return matches;
}
