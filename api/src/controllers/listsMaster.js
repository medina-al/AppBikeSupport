//Custom code
const { ListsMaster } = require("../db.js");
const response = require("../common/response");
//External libraries

////////////////////////////////// LISTS MASTER //////////////////////////////////

//----------------------------- Get all or a single list -----------------------------//
async function getLists(req) {
  try {
    if (req.params.global == null) {
      where = {};
    } else {
      where = { global: req.params.global };
    }

    let lists = await ListsMaster.findAll({
      where,
    });
    
    return response(
      req.params,
      {
        title: "Lists",
        data: lists,
        status: 200,
      },
      "getLists"
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
      "getLists"
    );
  }
}
//----------------------------- End get all or a single list -----------------------------//

module.exports = {
  getLists,
};
