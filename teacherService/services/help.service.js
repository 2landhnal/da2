import { sendToQueue } from '../config/messageQueue/connect.js';
import { FirebaseRepo } from '../models/repositories/firebase.repo.js';

export class HelpService {
    static changeAvatar = async ({ uid, file }) => {
        const fileExtension = file.originalname.split('.').pop();
        const pathToSave = `avatar/teacher/${uid}.${fileExtension}`;
        const { fileUpload, publicUrl } = await FirebaseRepo.uploadFile({
            pathToSave,
            file,
        });
        sendToQueue(
            'teacher_changeAvatarUrl',
            JSON.stringify({ avatar: publicUrl, uid }),
        );
    };
}
