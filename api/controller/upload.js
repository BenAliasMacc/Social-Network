const User = require('../models/User');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfilPic = async (req, res) => {
    try {
        if (
            req.file.detectedMimeType !== 'image/jpg' &&
            req.file.detectedMimeType !== 'image/png' &&
            req.file.detectedMimeType !== 'image/jpeg'

        ) throw Error('Type de fichier invalide');

        if (req.file.size > 500000) throw Error('Fichier trop volumineux')
    } catch (error) {
        return res.status(201).json(error)
    }

    const fileName = req.body.name + '.jpg';

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )
};