const express = require('express');
const { createChat, findChat, userChats, 
    createGroupChat,fetchUserGroups,
    createGroupInvitation,getPendingInvitations,
    acceptInvitation } = require('../controllers/ChatController.js');
const router = express.Router()

router.post('/', createChat);
router.post('/creategroup', createGroupChat);
router.post('/invite', createGroupInvitation);
router.get('/groups/:userId', fetchUserGroups);
router.get('/invitations/:userId', getPendingInvitations);
router.patch('/invitation/accept', acceptInvitation);


router.get('/:userId', userChats);
router.get('/find/:firstId/:secondId', findChat);

module.exports = router