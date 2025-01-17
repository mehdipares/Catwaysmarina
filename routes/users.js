const express = require('express');
const router = express.Router();

const service = require('../services/users');
//la route pour lire les infos d'un utilisateur
router.get('/:id',service.getById);
//route ajout utilisateur
router.put('/add', service.add);
//route modif utilisateur
router.patch('/:id', service.update);
//route supprimer utilisateur
router.delete('/:id', service.delete);

//route authenticate
router.post('/authenticate', service.authenticate);


module.exports = router;
