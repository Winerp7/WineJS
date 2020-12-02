import mongoose, { Document } from 'mongoose';

export interface IFunctionality extends Document {
    name: string;
    setup: string;
    loop: string; 
    description: string; 
    reboot: Boolean; 
    owner: mongoose.Types.ObjectId; 
  }

const functionalitySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, 
        required: 'You must supply a name'
    },
    setup: {
        type: String,
        default: 'No code'
    },
    loop: {
        type: String, 
        default: 'No code'
    },
    description: {
        type: String,
        default: 'No description'
    },
    reboot: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: 'You must supply a user'
    }
});

// 'Functionality' is the table that it should use/create in the DB
const Functionality = mongoose.model<IFunctionality>('Functionality', functionalitySchema);

export { Functionality };
