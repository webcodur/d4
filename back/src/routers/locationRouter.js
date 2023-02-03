const { Router } = require("express");
const guModel = require("../db/schemas/gu");
const pinModel = require("../db/schemas/pin");
const locationService = require("../services/locationService");

const locationRouter = Router();

locationRouter.get("/gus", async (req, res, next) => {
  try {
    const guNameAndIdList = await locationService.getGuNameAndIdList();
    res.status(200).json(guNameAndIdList);
  } catch (error) {
    next(error);
  }
});

locationRouter.get("/gus/:guId", async (req, res, next) => {
  try {
    const { guId } = req.params;
    const dongsAndPins = await locationService.getDongsAndPins(guId);
    res.status(200).json(dongsAndPins);
  } catch (error) {
    next(error);
  }
});

locationRouter.get("/gus/:guId/dongs", async (req, res) => {
  const { guId } = req.params;
  const dongs = await locationService.getDongsByGuId(guId);
  res.status(200).json(dongs);
});

locationRouter.get("/gus/:guId/pins", async (req, res) => {
  const { guId } = req.params;
  const foundGu = await guModel.findOne({ _id: guId });

  const pinsData = await pinModel.find({ guId });
  const pins = [];
  pinsData.map((pin) => {
    const pinData = {
      _id: pin._id,
      name: pin.name,
      longitude: pin.longitude,
      latitude: pin.latitude,
    };
    pins.push(pinData);
  });

  const foundGuData = { _id: guId, name: foundGu.name, pins };

  res.status(200).json(foundGuData);
});

module.exports = locationRouter;
