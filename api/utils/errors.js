module.exports.registerErrors = (error) => {
    let errors = { pseudo: '', email: '', password: '' }
    
    error.message.includes('pseudo') && (errors.pseudo = 'Pseudo incorrect');
    error.message.includes('email') && (errors.email = 'Email incorrect');
    error.message.includes('password') && (errors.password = 'Le mot de passe doit faire 6 caractéres minimum');

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('pseudo')) {(errors.pseudo = 'Pseudo déja utilisé')};
    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('email')) {(errors.email = 'Email déja utilisé')};
    
    return errors
}

module.exports.loginErrors = (error) => {
    let errors = { email: '', password: '' }

    error.message.includes('email') && (errors.email = 'Email inconnu');
    error.message.includes('password') && (errors.password = 'Mot de passe erroné');
    
    return errors
}

module.exports.updateErrors = (error) => {
    let errors = { pseudo: '', email: '', password: '' }
    
    error.message.includes('pseudo') && (errors.pseudo = 'Pseudo incorrect');
    error.message.includes('email') && (errors.email = 'Email incorrect');
    error.message.includes('password') && (errors.password = 'Le mot de passe doit faire 6 caractéres minimum');

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('pseudo')) {(errors.pseudo = 'Pseudo déja pris')};
    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('email')) {(errors.email = 'Email déja pris')};
    
    return errors
}

module.exports.uploadErrors = (error) => {
    let errors = { format: '', maxSize: '' }
    
    error.message.includes('Invalid file') && (errors.format = 'Format du fichier incompatible');
    error.message.includes('max size') && (errors.pseudo = 'Le fichier dépasse 500ko');
    
    return errors
}