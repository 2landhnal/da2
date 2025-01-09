import { sendToQueue } from '../config/messageQueue/connect.js';
import { TmpRepo } from '../models/repositories/tmp.repo.js';
import { RoleCode } from '../utils/roleCode.js';
export class MqService {
    static uploadAvatar = ({ avatar, uid }) => {
        const { mimetype, originalname, size } = avatar;
        const fileExtension = originalname.split('.').pop();
        const nameToSave = `${uid}.${fileExtension}`;
        const filePath = TmpRepo.saveToTemp({
            file: avatar,
            nameToSave,
        });
        const msgObject = {
            mimetype,
            originalname,
            size,
            filePath,
            uid,
            header_role: RoleCode.BCTSV,
        };
        console.log(msgObject);
        sendToQueue('student_changeAvatar', JSON.stringify(msgObject));
        return true;
    };
}
