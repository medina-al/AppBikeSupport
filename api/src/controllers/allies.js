//Custom code
const {
  Allies,
  AllyImages,
  AllyRatings,
  AllyUsers,
  AllySchedules,
  AllyServices,
  ListsMaster,
  Users,
} = require("../db.js");
const response = require("../common/response");
const { conn } = require("../db.js");
//External libraries
const { Op, Sequelize } = require("sequelize");

////////////////////////////////// ASSISTS //////////////////////////////////

//----------------------------- Get all or a single ally -----------------------------//
async function getAllies(req) {
  try {
    let where = {};
    if (req.params.assistId != null) {
      where.id = req.params.assistId;
    }
    if (req.query.status != null) where.status = req.query.status;

    let allies = await Allies.findAll({
      where,
      include: [
        {
          model: AllyRatings,
        },
        {
          model: AllyServices,
        },
        {
          model: AllyImages,
        },
        {
          model: AllySchedules,
          include: [
            {
              model: ListsMaster,
              attributes: ["id", "secondValue", "thirdValue"],
              order: [["thirdValue", "ASC"]],
            },
          ],
        },
      ],
    });

    allies.map((ally) => {
      if (ally.AllyRatings.length > 0) {
        let rateCount = 0;
        ally.AllyRatings.map((rating) => {
          rateCount += rating.rate;
        });
        ally.dataValues.averageRating = (
          rateCount / ally.AllyRatings.length
        ).toFixed(0);
      }
    });

    return response(
      req.params,
      {
        title: "Allies",
        data: allies,
        status: 200,
      },
      "getAllies"
    );
  } catch (err) {
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(err),
        status: 500,
        success: false,
      },
      "getAllies"
    );
  }
}
//----------------------------- End get all or a single ally -----------------------------//

//----------------------------- Get allyby userId -----------------------------//
async function getAllyByUser(req) {
  try {
    let ally = await AllyUsers.findOne({
      where: {user_id:req.params.userId},
      include: [
        {
          model: Allies,
          include: [
            {
              model: AllyServices,
            },
            {
              model: AllyImages,
            },
            {
              model: AllySchedules,
              include: [
                {
                  model: ListsMaster,
                  attributes: ["id", "secondValue", "thirdValue"],
                  order: [["thirdValue", "ASC"]],
                },
              ],
            },
          ]
        }
      ]
    });

    return response(
      req.params,
      {
        title: "Ally",
        data: ally,
        status: 200,
      },
      "getAllyByUser"
    );
  } catch (err) {
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(err),
        status: 500,
        success: false,
      },
      "getAllyByUser"
    );
  }
}
//----------------------------- End Get allyby userId -----------------------------//

//----------------------------- Create ally -----------------------------//
async function createAlly(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    //Create row in database
    const newAlly = await Allies.create({
      name: req.body.name,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      address: req.body.address,
      phone: req.body.phone,
      mobile: req.body.mobile,
    });

    if (newAlly === null) throw { error: "Error creating ally", status: 400 };

    const days = await ListsMaster.findAll({
      where: {global: 'DIAS'}
    });

    await Promise.all(
      days.map(async (schedule) => {
        await AllySchedules.create({
          ally_id: newAlly.id,
          day_id: schedule.id
        });
      })
    );

    await t.commit();
    return response(
      req.body,
      {
        title: "New ally created",
        data: newAlly,
        status: 200,
      },
      "createAlly"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
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
      "createAlly"
    );
  }
}
//----------------------------- End create ally  -----------------------------//

//----------------------------- Edit ally -----------------------------//
async function editAlly(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    console.log(req.params);
    //Create row in database
    let ally = await Allies.findByPk(req.params.allyId);
    ally.name = req.body.name;
    ally.description = req.body.description;
    ally.latitude = req.body.latitude;
    ally.longitude = req.body.longitude;
    ally.address = req.body.address;
    ally.phone = req.body.phone;
    ally.mobile = req.body.mobile;
    ally.status = req.body.status;

    const editedAlly = await ally.save();

    if (editedAlly === null) throw { error: "Error editing ally", status: 400 };

    if (req.body.schedules) {
      try {
        await Promise.all(
          req.body.schedules.map(async (schedule) => {
            await AllySchedules.upsert({
              id: schedule.id,
              ally_id: req.params.allyId,
              day_id: schedule.day_id,
              open_time: schedule.open_time,
              close_time: schedule.close_time,
            });
          })
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    if (req.body.services) {
      try {
        await Promise.all(
          req.body.services.map(async (service) => {
            await AllyServices.upsert({
              id: service.id,
              ally_id: req.params.allyId,
              service: service.service,
              description: service.description,
            });
          })
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "Ally edited",
        data: editedAlly,
        status: 200,
      },
      "editAlly"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
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
      "editAlly"
    );
  }
}
//----------------------------- End edit ally -----------------------------//

//----------------------------- Associate user to ally -----------------------------//
async function associateUser(req) {
  const t = await conn.transaction();
  try {
    console.log(req.params);
    //Create row in database
    let allyUser = await AllyUsers.create({
      ally_id: req.params.allyId,
      user_id: req.params.userId,
      user_owner: (req.params.userType=='ALIADO'?true:false)
    }); 

    if (allyUser === null) throw { error: "Error adding ally user", status: 400 };

    let user = await Users.findByPk(req.params.userId);
    user.type=req.params.userType;
    const editedUser = await user.save();
    if (editedUser === null) throw { error: "Error updating user", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "Ally User created",
        data: allyUser,
        status: 200,
      },
      "associateUser"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
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
      "associateUser"
    );
  }
}
//----------------------------- End associate user to ally -----------------------------//

//----------------------------- Associate user to ally -----------------------------//
async function handleAllyImage(req) {
  const t = await conn.transaction();
  try {
    console.log(req.params);
    let data;
    if(req.params.imageId==0){
      const allyImage = await AllyImages.create({
        url: req.file.path,
        ally_id: req.params.allyId
      })

      if (allyImage === null) throw { error: "Error adding ally image", status: 400 };
      data=allyImage;
    }else{
      await AllyImages.destroy({
        where: {
          id: req.params.imageId,
        },
      });
      data=0;
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "Ally images updated",
        data: data,
        status: 200,
      },
      "handleAllyImage"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
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
      "handleAllyImage"
    );
  }
}
//----------------------------- End associate user to ally -----------------------------//

module.exports = {
  getAllies,
  getAllyByUser,
  createAlly,
  editAlly,
  associateUser,
  handleAllyImage,
};
