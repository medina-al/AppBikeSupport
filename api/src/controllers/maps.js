//Custom code
const { Maps, MapPoints } = require("../db.js");
const { conn } = require("../db.js");
const response = require("../common/response.js");
//External libraries
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

////////////////////////////////// MAPS //////////////////////////////////

//----------------------------- Get all or a single map -----------------------------//

async function getMaps(req) {
  try {
    let where = {}
    if (req.params.mapId != null) {
      where.id= req.params.mapId 
    }

    if (req.query.status != null) {
      where.status= req.query.status 
    }

    console.log(where);
    const maps = await Maps.findAll({
      where,
      include: [
        {
          model: MapPoints,
        },
      ],
    });
    return response(
      req.body,
      {
        title: "Maps",
        data: maps,
        status: 200,
      },
      "getMaps"
    );
  } catch (err) {
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
      "getMaps"
    );
  }
}
//----------------------------- End get all or a single map -----------------------------//

//----------------------------- Create map  -----------------------------//
async function createMap(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    let newMap = await Maps.create({
      name: req.body.name,
      type: req.body.type,
      icon: req.body.icon,
      marker_icon: req.body.marker_icon,
    });
    if (newMap === null) throw { error: "Error creating map", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "New map created",
        data: newMap,
        status: 200,
      },
      "createMap"
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
      "createMap"
    );
  }
}

//----------------------------- End Create map -----------------------------//

//----------------------------- Edit map -----------------------------//
async function editMap(req) {
  const t = await conn.transaction();
  try {
    let map = await Maps.findByPk(req.params.mapId);
    map.name = req.body.name;
    map.type = req.body.type;
    map.icon = req.body.icon;
    map.marker_icon = req.body.marker_icon;
    map.status = req.body.status;
    let editedMap = await map.save();

    if (editedMap === null) throw { error: "Error editing map", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "Map edited",
        data: map,
        status: 200,
      },
      "editMap"
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
      "editMap"
    );
  }
}

//----------------------------- End Edit map  -----------------------------//

//----------------------------- Create map point  -----------------------------//
async function createPoint(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    console.log(req.params);
    let newPoint = await MapPoints.create({
      title: req.body.title,
      description: req.body.description,
      schedule: req.body.schedule,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      map_id: req.body.map_id,
    });
    if (newPoint === null) throw { error: "Error creating point", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "New point created",
        data: newPoint,
        status: 200,
      },
      "createPoint"
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
      "createPoint"
    );
  }
}

//----------------------------- End Create map point  -----------------------------//

//----------------------------- Edit map points  -----------------------------//
async function editPoints(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    console.log(req.params);
    //Edit rows in database
    for (let i = 0; i < req.body.length; i++) {
      try {
        let point = await MapPoints.findByPk(req.body[i].id);
        point.title = req.body[i].title;
        point.description = req.body[i].description;
        point.schedule = req.body[i].schedule;
        point.latitude = req.body[i].latitude;
        point.longitude = req.body[i].longitude;
        let editedPoint = await point.save();
        if (editedPoint === null)
          throw { error: "Error editing bike", status: 400 };
      } catch (err) {
        throw err;
      }
    }

    let points = await MapPoints.findAll({
      where: { map_id: req.params.mapId },
    });

    await t.commit();
    return response(
      req.body,
      {
        title: "Map points edited",
        data: points,
        status: 200,
      },
      "editPoints"
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
      "editPoints"
    );
  }
}

//----------------------------- End Edit map points  -----------------------------//

module.exports = {
  getMaps,
  createMap,
  editMap,
  createPoint,
  editPoints,
};
