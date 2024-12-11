import { Schema, model, Document, Date } from 'mongoose';

interface Teacher extends Document {
    accountId: string;
    teacherId: string;
    fullName: string;
    address: string;
    phone: string;
    dob: Date;
    gender: string;
    degree: string;
    email: string;
    yoj: number; // joining year
}

const TeacherSchema = new Schema<Teacher>({
    accountId: { type: String, unique: true, required: true },
    teacherId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    dob: { type: Date, default: Date.now },
    gender: { type: String, default: 'Unknown' },
    degree: { type: String, default: 'Master' },
    email: { type: String, unique: true, required: true },
    yoj: { type: Number, required: true },
});

const TeacherModel = model<Teacher>('Teacher', TeacherSchema);

export { Teacher };
export default TeacherModel;
