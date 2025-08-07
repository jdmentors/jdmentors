import Service from "../models/service.model.js";

const createService = async (req, res) => {
    try {
        const { title, slug, description, process='', features, price, status } = req.body;

        const user = req.user;

        if(!title || !slug || !description || !price || !status){
            return res.status(400).json({success:false, message:'All fields are required.'});
        }

        const serviceExists = await Service.findOne({title});

        if(serviceExists){
            return res.status(400).json({success:false, message: 'Service already exists with this title'});
        }

        const service = await Service.create({title, slug, description, process, features, price, status, user:user._id});

        if(!service){
            return res.status(500).json({success: false, message: 'Error occured while creating service'});
        }

        return res.status(200).json({success: true, message: 'Service created'});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Service creation failed'});
    }
}

const getAService = async (req, res) => {
    try {
        const { slug } = req.params;

        if(!slug){
            return res.status(400).json({success:false, message: 'Slug is needed'});
        }

        const service = await Service.findOne({slug});

        if(!service){
            return res.status(404).json({success:false, message: 'No service found'});
        }

        return res.status(200).json({success: true, message: 'Service found', data: service});
    } catch (error) {
        return res.status(500).json({success:false, message: 'Failed to get service'});
    }
}

const getAllServices = async (req, res) => {
    try {
        const allServices = await Service.find();

        if(!allServices){
            return res.status(404).json({success:false, message: 'No services found'});
        }

        return res.status(200).json({success: true, message: 'Services found', data: allServices});
    } catch (error) {
        return res.status(500).json({success:false, message: 'Failed to get service'});
    }
}

const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        if(!serviceId){
            return res.status(400).json({success:false, message: 'Service ID needed to delete'});
        }

        const service = await Service.findByIdAndDelete(serviceId);

        if(!service){
            return res.status(500).json({success:false, message: 'No service found'});
        }

        return res.status(200).json({success:true, message: 'Service deleted'});
    } catch (error) {
        return res.status(500).json({success:false, message: 'Deletion failed'});
    }
}

export {
    createService,
    getAService,
    getAllServices,
    deleteService,
}