const express = require('express')
const Car = require('./cars-model')
const {
    checkCarId,
    checkCarPayload,
    checkVinNumberValid,
    checkVinNumberUnique
} = require('./cars-middleware')

const router = express.Router()

router.get('/', async (req, res, next) => {
    try{
        const cars = await Car.getAll();
        res.status(200).json(cars);

    } catch (error) {
        next(error);
    }
})

router.get('/:id', checkCarId, (req, res) => {
    Car.getById(req.params.id)
      .then(cars => {
        res.json(cars);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to retrieve cars' });
      });
  });

router.post('/', checkCarPayload, checkVinNumberValid, checkVinNumberUnique, async (req, res, next) => {
    try {
      const cars = await Car.create(req.body);
      res.status(201).json(cars);
    } catch (error) {
      next(error);
    }
})

router.use((err, req, res, next) => {

    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    })
})

module.exports = router