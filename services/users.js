//import modele de données
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//export callback afin d'y accéder dans gestionnaire de routes
//Ici c'est le callback qui servira à ajouter un user avec son id

exports.getById = async (req, res, next) => {
    const id = req.params.id
    
    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}


//call back ajout user

exports.add = async (req, res, next) => {
    
    const temp = ({
        name     : req.body.name,
        firstname: req.body.firstname,
        email    : req.body.email,
        password : req.body.password
    });


    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
    }

    
}

//call back modif user

exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        name     : req.body.name,
        firstname: req.body.firstname,
        email    : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.findOne({_id : id});

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

//call back supprimer user
exports.delete = async (req, res, next) => {
    const id = req.param.id

    try {
        await User.deletone ({_id: id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.authenticate = async (req, res, next) => {

    const { email, password } = req.body;



    try {

        // Vérification que les champs requis sont fournis

        if (!email || !password) {

            return res.status(400).json({ error: 'email_and_password_required' });

        }



        // Recherche de l'utilisateur par email

        let user = await User.findOne({ email: email }).select('-__v -createdAt -updatedAt');



        if (user) {
            
            console.log('Password from DB:', user.password);

            // Comparaison des mots de passe

            const isMatch = await bcrypt.compare(password, user.password);



            if (isMatch) {

                // Suppression du mot de passe de la réponse

                delete user._doc.password;



                const expireIn = 24 * 60 * 60; // 24 heures

                const token = jwt.sign(

                    { user: user },

                    process.env.SECRET_KEY, // Utilisez une variable d'environnement pour la clé secrète

                    { expiresIn: expireIn }

                );



                // Ajout du token dans le header

                res.header('Authorization', 'Bearer ' + token);



                return res.status(200).json({ message: 'authenticate_succeed', token });

            } else {

                return res.status(403).json({ error: 'wrong_credentials' });

            }

        } else {

            return res.status(404).json({ error: 'user_not_found' });

        }

    } catch (error) {

        return res.status(500).json({ error: error.message });

    }

};