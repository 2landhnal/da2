import { Schema, model, Document, Date, Number } from 'mongoose';

interface Student extends Document {
    studentId: string;
    fullName: string;
    address: string;
    phone: string;
    dob: Date;
    gender: string;
    email: string;
    yoa: Number; //year of admission
}

const StudentSchema = new Schema<Student>({
    studentId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    dob: { type: Date, default: Date.now },
    gender: { type: String, default: 'Unknown' },
    email: { type: String, unique: true, required: true },
    yoa: { type: Number, required: true },
});

const StudentModel = model<Student>('Student', StudentSchema);

export { Student };
export default StudentModel;
