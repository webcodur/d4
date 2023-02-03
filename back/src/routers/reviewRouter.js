const { Router } = require("express");
const reviewService = require("../services/reviewService");
const passwordMiddleware = require("../middlewares/passwordMiddleware");
const postRequestLimiter = require("../middlewares/ipLimitMiddleware");
const { GET_QUERY_DEFAULT_VALUES } = require("../constants");

const router = Router();

//create review
router.post("/", postRequestLimiter, async (req, res, next) => {
  try {
    const { guId, dongId, title, description, password, noiseLevel } = req.body;

    const newReview = await reviewService.create({
      guId,
      dongId,
      title,
      description,
      password,
      noiseLevel,
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

//get reviews
router.get("/", async (req, res, next) => {
  try {
    const getQuery = { ...GET_QUERY_DEFAULT_VALUES, ...req.query };
    const { guId, dongId, skip, limit, noiseLevel } = getQuery;

    const reviews = await reviewService.getList(
      guId,
      dongId,
      Number.parseInt(skip, 10),
      Number.parseInt(limit, 10),
      Number.parseInt(noiseLevel, 10)
    );

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

//get reveiw count
router.get("/count", async (req, res, next) => {
  try {
    const guId = req.query.guId ?? null;
    const dongId = req.query.dongId ?? null;

    const count = await reviewService.getCount(guId, dongId);

    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
});

//check password
router.post("/:reviewId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const password = req.body.password;

    const result = await reviewService.checkPassword(reviewId, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//update review
router.put("/:reviewId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const updates = ["title", "description", "noiseLevel"];
    let toUpdate = {};

    updates.forEach((update) => {
      if (req.body[update]) {
        toUpdate[update] = req.body[update];
      }
    });

    const updatedReview = await reviewService.update(reviewId, toUpdate);

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
});

//delete review
router.delete("/:reviewId", passwordMiddleware, async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;

    const deletedReview = await reviewService.delete(reviewId);

    res.status(200).json(deletedReview);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
