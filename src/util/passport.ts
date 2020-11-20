import passport from "passport";
import { User } from "../models/userModel";

// Create user
passport.use(User.createStrategy());
// Login user
passport.serializeUser(User.serializeUser());
// Keep authenticating the session for the user
passport.deserializeUser(User.deserializeUser());
