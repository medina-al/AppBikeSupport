//Custom code
const { ListsMaster } = require("../db.js");
const { conn } = require("../db.js");
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

//----------------------------- Add value to list -----------------------------//
async function createListValue(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    let newList = await ListsMaster.create({
      global: req.body.global,
      firstValue: req.body.firstValue,
      secondValue: req.body.secondValue,
      thirdValue: req.body.thirdValue,
    });
    if (newList === null) throw { error: "Error creating list value", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "New list value created",
        data: newList,
        status: 200,
      },
      "createListValue"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
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
      "createListValue"
    );
  }
}
//----------------------------- End Add value to list -----------------------------//

//----------------------------- Edit list value -----------------------------//
async function editListValue(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    let list = await ListsMaster.findByPk(req.params.listId);
    list.global = req.body.global;
    list.firstValue = req.body.firstValue;
    list.secondValue = req.body.secondValue;
    list.thirdValue = req.body.thirdValue;
    
    let editedList = await list.save();

    if (editedList === null) throw { error: "Error editing list", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "List updated",
        data: editedList,
        status: 200,
      },
      "editListValue"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
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
      "editListValue"
    );
  }
}
//----------------------------- End Edit list value -----------------------------//

module.exports = {
  getLists,
  createListValue,
  editListValue
};
