//Custom code
const { Recommendations, RecommendationMedias } = require("../db.js");
const response = require("../common/response");
const { conn } = require("../db.js");

////////////////////////////////// RECOMMENDATIONS //////////////////////////////////

//----------------------------- Get all or a single recommendations -----------------------------//
async function getRecommendations(req) {
  try {
    let where = {};
    if (req.params.recId != null) {
      where.id = req.params.recId;
    }
    if (req.query.status != null) where.status = req.query.status;

    console.log(where);

    let recommendations = await Recommendations.findAll({
      where,
      include: [RecommendationMedias],
    });

    return response(
      req.params,
      {
        title: "Recommendations",
        data: recommendations,
        status: 200,
      },
      "getRecommendations"
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
      "getRecommendations"
    );
  }
}
//----------------------------- End get all or a single recommendations -----------------------------//

//----------------------------- Create recommendation -----------------------------//
async function createRecommendation(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    //Create row in database
    const newRecommendation = await Recommendations.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type
    });

    if (newRecommendation === null)
      throw { error: "Error creating recommendation", status: 400 };

    if (req.body.type == "IMAGE") {
      if (req.files) {
        await Promise.all(
          req.files.map(async (image) => {
            try {
              await RecommendationMedias.create({
                url: image.url,
                type: "image",
                rec_id: newRecommendation.id,
              });
            } catch (err) {
              throw err;
            }
          })
        );
      }
    } else {
      let newRecMedia = await RecommendationMedias.create({
        url: req.body.video,
        type: "video",
        rec_id: newRecommendation.id,
      });
      if (newRecMedia === null)
        throw { error: "Error creating recommendation", status: 400 };
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "New recommendation created",
        data: newRecommendation,
        status: 200,
      },
      "createRecommendation"
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
      "createRecommendation"
    );
  }
}
//----------------------------- End Create recommendation -----------------------------//

//----------------------------- Edit recommendation -----------------------------//
async function editRecommendation(req) {
  const t = await conn.transaction();
  try {
    let recommendation = await Recommendations.findByPk(req.params.recId);
    recommendation.title = req.body.title;
    recommendation.description = req.body.description;
    recommendation.status = req.body.status;
    const editedRecommendation = await recommendation.save();

    if (editedRecommendation === null)
      throw { error: "Error editing recommendation", status: 400 };

    if (req.body.type == "VIDEO") {
      let recMedia = await RecommendationMedias.findOne({
        where: { rec_id: req.params.recId },
      });
      recMedia.url = req.body.video;
      let editedRecMedia = await recMedia.save();
      if (editedRecMedia === null)
        throw { error: "Error editing recommendation media", status: 400 };
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "Recommendation edited",
        data: editedRecommendation,
        status: 200,
      },
      "editRecommendation"
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
      "editRecommendation"
    );
  }
}
//----------------------------- End Edit recommendation -----------------------------//

//----------------------------- Handle images -----------------------------//
async function handleRecImage(req) {
  const t = await conn.transaction();
  try {
    let data;
    if(req.params.imageId==0){
      const recImage = await RecommendationMedias.create({
        url: req.file.path,
        rec_id: req.params.recId,
        type: "image"
      })

      if (recImage === null) throw { error: "Error adding recommendation image", status: 400 };
      data=recImage;
    }else{
      await RecommendationMedias.destroy({
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
        title: "Recommendation images updated",
        data: data,
        status: 200,
      },
      "handleRecImage"
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
      "handleRecImage"
    );
  }
}
//----------------------------- End Handle images -----------------------------//

module.exports = {
  getRecommendations,
  createRecommendation,
  editRecommendation,
  handleRecImage,
};
