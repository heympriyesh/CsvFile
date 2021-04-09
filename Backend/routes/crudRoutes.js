const { Router } = require('express');
const crudController = require('../controllers/crudController')
const router = Router();


router.get('/getDetails', crudController.show_Data);
router.post('/addDetails',crudController.add_Data);
router.patch('/updateDetails/:id',crudController.update_Data);
router.get('/download',crudController.download_Data);
router.post('/upload',crudController.upload_File);
router.delete('/delteDetails/:id',crudController.delete_Data);
router.get('/validateData',crudController.validate_Data);
router.post('/addFileDetails',crudController.add_File_Details);

module.exports=router