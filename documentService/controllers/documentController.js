const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const { firestore, bucket } = require('../config');

class DocumentController {
    get = async (req, res) => {
        try {
            const accountId = req.body.accountId;
            console.log('accountId ', accountId);
            const snapshot = await firestore
                .collection('documents')
                .where('accountId', '==', accountId)
                .get();

            if (snapshot.empty) {
                console.log('Empty');
                return res.status(200).json([]);
            }

            // Map the documents to the desired structure
            const fileList = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    name: data.fileName,
                    id: doc.id,
                    filePath: data.filePath,
                    url: data.fileUrl,
                };
            });

            // Send response
            res.status(200).json(fileList);
        } catch (error) {
            res.status(400).send(error.message);
            console.error('Error querying file:', error);
        }
    };
    deleteFile = async (req, res) => {
        console.log('delete called');
        try {
            // const { accountId } = req.body;
            const docId = req.params.docId;
            console.log(docId);

            // if (!accountId || !fileName) {
            //     return res
            //         .status(400)
            //         .json({ message: 'accountId and fileName are required' });
            // }

            const docRef = firestore.collection('documents').doc(docId);
            const doc = (await docRef.get()).data();

            const filePath = doc.filePath;
            console.log(filePath);

            const file = bucket.file(filePath);

            // Check if the file exists before deleting
            const [exists] = await file.exists();
            if (!exists) {
                console.log('File not found');
                return res.status(404).json({ message: 'File not found' });
            }

            // Delete the file
            await file.delete();
            await docRef.delete();
            console.log(`Deleted file: ${doc.fileName}`);

            res.status(200).json({
                message: 'File deleted successfully',
                filePath,
            });
        } catch (error) {
            res.status(400).send(error.message);
            console.error('Error deleting file:', error);
        }
    };

    uploadFile = async (req, res) => {
        try {
            console.log(req.body.accountId);
            const accountId = req.body.accountId;
            const file = req.file;

            if (!file) return res.status(400).send('No file uploaded.');

            // Đặt tên file duy nhất và đường dẫn trong bucket
            const uniqueFileName = `documents/${accountId}/${v4()}_${
                file.originalname
            }`;
            const fileUpload = bucket.file(uniqueFileName);

            // Tải file lên Firebase Storage
            await fileUpload.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
                public: false,
            });

            // Lấy URL của file từ Firebase Storage
            const filePath = `${fileUpload.name}`;
            const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

            // Lưu thông tin vào Firestore
            const docRef = firestore.collection('documents').doc(); // Create a new document
            await docRef.set({
                accountId,
                filePath, // relative path in bucket
                fileURL, // Lưu URL vào Firestore
                fileName: file.originalname,
            });

            res.status(200).send('Uploaded successfully');
        } catch (error) {
            res.status(400).send(error.message);
            console.error('Error uploading file:', error);
        }
    };

    download = async (req, res) => {
        const docId = req.params.id;

        try {
            const docRef = firestore.collection('documents').doc(docId);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).send('File not found');
            } else if (doc.data().accountId != req.body.accountId) {
                return res
                    .status(401)
                    .send('You dont have permission to access this file');
            }

            const fileData = doc.data();
            const filePath = fileData.filePath;
            const fileName = fileData.fileName; // Tên file gốc
            console.log(fileName);

            const file = bucket.file(filePath);
            const [fileBuffer] = await file.download();

            // Set header và gửi về client
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                fileName: fileName,
                fileContent: fileBuffer.toString('base64'), // Encode thành base64
            });
        } catch (error) {
            console.error('Error downloading file:', error);
            res.status(500).send('Error downloading file');
        }
    };
}

module.exports = new DocumentController();
