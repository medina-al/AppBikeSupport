//Custom code
const { ListsMaster, Bicycles, BicycleImages } = require("../db.js");
const { conn } = require("../db.js");
const response = require("../common/response");
//External libraries
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { Op } = require("sequelize");

////////////////////////////////// BICYCLES //////////////////////////////////

//----------------------------- Create bicycle  -----------------------------//
async function createBicycle(req) {
  const t = await conn.transaction();
  try {
    //Create row in database
    const newBike = await Bicycles.create({
      description: req.body.description,
      brand: req.body.brand,
      model: req.body.model,
      line: req.body.line,
      wheel_size: req.body.wheel_size,
      wheels: req.body.wheels,
      front_groupset: req.body.front_groupset,
      back_groupset: req.body.back_groupset,
      brakes: req.body.brakes,
      user_id: req.body.user_id,
      material_id: req.body.material_id,
      type_id: req.body.type_id,
      brakes_type_id: req.body.brakes_type_id,
      public: req.body.public,
    });

    if (newBike === null)
      throw { error: "Error creating bicycle", status: 400 };

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        try {
          await BicycleImages.create({
            url: req.files[i].path,
            bicycle_id: newBike.id,
          });
        } catch (err) {
          throw err;
        }
      }
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "New bicycle created",
        data: newBike,
        status: 200,
      },
      "createBicycle"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.file) fs.unlinkSync(req.file.path);
    let error = err.error ? err.error : err;
    let status = err.error ? err.status : 500;
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(error),
        status: status,
        success: false,
      },
      "createBicycle"
    );
  }
}
//----------------------------- End create bicycle  -----------------------------//

//----------------------------- Edit bicycle  -----------------------------//
async function editBicycle(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    console.log(req.params);

    //Edit row in database
    let bike = await Bicycles.findByPk(req.params.bicycleId);
    bike.description = req.body.description;
    bike.brand = req.body.brand;
    bike.model = req.body.model;
    bike.line = req.body.line;
    bike.wheel_size = req.body.wheel_size;
    bike.wheels = req.body.wheels;
    bike.front_groupset = req.body.front_groupset;
    bike.back_groupset = req.body.back_groupset;
    bike.brakes = req.body.brakes;
    bike.user_id = req.body.user_id;
    bike.material_id = req.body.material_id;
    bike.type_id = req.body.type_id;
    bike.brakes_type_id = req.body.brakes_type_id;
    bike.public = req.body.public;

    const editedBike = await bike.save();

    if (editedBike === null) throw { error: "Error editing bike", status: 400 };

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        try {
          await BicycleImages.create({
            url: req.files[i].path,
            bicycle_id: bike.id,
          });
        } catch (err) {
          throw err;
        }
      }
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "Bicycle edited",
        data: editedBike,
        status: 200,
      },
      "editBicycle"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.file) fs.unlinkSync(req.file.path);
    let error = err.error ? err.error : err;
    let status = err.error ? err.status : 500;
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(error),
        status: status,
        success: false,
      },
      "editBicycle"
    );
  }
}
//----------------------------- End edit bicycle  -----------------------------//

module.exports = {
  createBicycle,
  editBicycle,
};
