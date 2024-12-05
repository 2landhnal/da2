import { Schema, model, Document } from 'mongoose';

interface Teacher extends Document {
    accountId: string;
    privateKey: string;
    publicKey: string;
    signature: string;
    alias: string;
    avatarUrl: string;
    createdAt: Date;
}

const SignatureSchema = new Schema<Signature>({
    accountId: { type: String, required: true },
    privateKey: { type: String, required: true },
    publicKey: { type: String, required: true },
    signature: { type: String, required: true },
    alias: { type: String, required: false, default: 'Untitled' },
    avatarUrl: { type: String, required: false, default: '' },
    createdAt: { type: Date, required: true, default: Date.now },
});

const SignatureModel = model<Signature>('Signature', SignatureSchema);

export default SignatureModel;
