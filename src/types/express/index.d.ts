// cannot use normal imports since it changes the scope from global to local 🤷‍♂️
// * DONT DO THIS *
//import { Node } from "../../models/nodeModel";

declare namespace Express {
  interface Request {
    nodes?: import("../../models/nodeModel").INode[];
    functionalities?: import("../../models/functionalityModel").IFunctionality[]; 
  }
}
