const db = require('../../data/db-config');
const Car = require('./cars-model');
var vinValidator = require('vin-validator');
var isValidVin = vinValidator.validate('11111111111111111');

const checkCarId = async (req, res, next) => {
  try {
    const cars = await Car.getById( req.params.id )
    if( !cars ) {
     next({ 
       status: 404, message: "car not found"
       })
 
    } else {
      req.cars = cars;
      next();
    }
    }catch(error){
      next(error);
    }
}

const checkCarPayload = (req, res, next) => {
  if(!req.body.vin) 
    return next({ 
      status:400, message: "vin is missing"
    });

    if(!req.body.make) 
    return next({ 
      status:400, message: "make is missing"
    });

    if(!req.body.model) 
    return next({ 
      status:400, message: "model is missing" 
    });

    if(!req.body.mileage) 
    return next({ 
      status:400, message: "mileage is missing" 
    });

    next();
}


const checkVinNumberValid = (req, res, next) => {
  if(isValidVin(req.body.vin)){
    next();
  } else {
    next({ 
      status: 400, message: `vin ${req.body.vin} is invalid` 
    })
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  try {
    const vin = await Car.getById(req.body.id)
      .where({ vin: req.body.vin})
      .first()

    if (!vin) {
      next({ 
        status:400, message: `vin ${req.body.vin} already exists`
      })

    } else {
      next();
    }

  } catch (error) {
    next(error);
  }
}


module.exports = {
  checkCarId, 
  checkCarPayload,
  checkVinNumberUnique,
  checkVinNumberValid
}