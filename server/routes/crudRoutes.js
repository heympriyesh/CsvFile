const { Router } = require('express');
const crudController = require('../controllers/crudController')
const router = Router();


router.get('/getDetails', crudController.show_Data);
router.post('/addDetails',crudController.add_Data);
router.patch('/updateDetails/:id',crudController.update_Data);
router.get('/download',crudController.download_Data);
router.delete('/delteDetails/:id',crudController.delete_Data);

module.exports=router