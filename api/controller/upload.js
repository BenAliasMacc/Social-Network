const User = require('../models/User');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors');

module.exports.uploadProfilPic = async (req, res) => {
    try {
        if (
            req.file.detectedMimeType != 'image/jpg' &&
            req.file.detectedMimeType != 'image/png' &&
            req.file.detectedMimeType != 'image/jpeg'

        ) throw Error('Invalid file');

        if (req.file.size > 500000) throw Error('Max size')
        res.status(201).send('Succesfully upload');
    } catch (error) {
        const errors = uploadErrors(error);
        res.status(201).json({ errors });
    };

    const fileName = req.body.name + '.jpg';

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../uploads/profil/${fileName}`
        )
    );

    try {
        await User.findByIdAndUpdate(
            req.body.userId, {
                $set: { picture: '../uploads/profil/' + fileName }
            },
            { new: true }
        )
    } catch (error) {
        res.status(500).send(error);
    };
};