import { bucket } from '../../config/firebase/index.js';

export class FirebaseRepo {
    static uploadFile = async ({ pathToSave, file }) => {
        try {
            // const fileExtension = file.originalname.split('.').pop();
            // const uniqueFileName = `avatars/${documentId}.${fileExtension}`;
            const fileUpload = bucket.file(pathToSave);

            await fileUpload.save(file.buffer, {
                metadata: { contentType: file.mimetype },
                public: true,
            });

            const publicUrl = fileUpload.publicUrl();
            return { fileUpload, publicUrl };
        } catch (error) {
            console.log('Error uploading file: ', error);
            throw error;
        }
    };
}
