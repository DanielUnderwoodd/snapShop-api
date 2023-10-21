const express = require("express");
const router = express.Router();
const productModel = require("../../models/product");

router.get("/products", async (req, res) => {
  try {
    let products = await productModel
      .aggregate([
        {
          $group: {
            _id: "$category",
            products: { $push: "$$ROOT" },
          },
        },
      ])
      .exec();
    res.status(200).json(products);
  } catch (err) {
    res.send(err);
  }
});

router.get("/products/search", async (req, res) => {
  try {
    let subjects = ["title", "description"];
    let regex = new RegExp(req.query.incomingData);
    const newSubjects = subjects.map((subject) => {
      return {
        [subject]: regex,
      };
    });
    const findResponse = await productModel.find({ $or: newSubjects });

    res.status(200).json({
      findResponse,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
