import { Schema, model, Document, Date } from 'mongoose';

interface Teacher extends Document {
    teacherId: string;
    fullName: string;
    address: string;
    phone: string;
    dob: Date;
    gender: string;
    degree: string;
    email: string;
}

const TeacherSchema = new Schema<Teacher>({
    teacherId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    dob: { type: Date, default: Date.now },
    gender: { type: String, default: 'Unknown' },
    degree: { type: String, default: 'Master' },
    email: { type: String, unique: true, required: true },
});

const TeacherModel = model<Teacher>('Teacher', TeacherSchema);

export default TeacherModel;
