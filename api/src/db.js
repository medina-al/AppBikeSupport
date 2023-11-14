const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

//Start sequelize
let sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  { logging: false, native: false }
);

const basename = path.basename(__filename);
const modelDefiners = [];
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Allies,
  AllyRatings,
  AllySchedules,
  AllyServices,
  AllyImages,
  AllyUsers,
  AssistImages,
  Assists,
  BicycleImages,
  Bicycles,
  ListsMaster,
  Maps,
  MapPoints,
  Recommendations,
  RecommendationMedias,
  Users,
  UserImages
} = sequelize.models;

//Allies
Allies.hasMany(AllyUsers, {foreignKey:"ally_id"});
AllyUsers.belongsTo(Allies, {foreignKey:"ally_id"});
Users.hasMany(AllyUsers, {foreignKey:"user_id"});
AllyUsers.belongsTo(Users, {foreignKey:"user_id"});
Allies.hasMany(AllySchedules, {foreignKey:"ally_id"});
AllySchedules.belongsTo(Allies, {foreignKey:"ally_id"});
Allies.hasMany(AllyServices, {foreignKey:"ally_id"});
AllyServices.belongsTo(Allies, {foreignKey:"ally_id"});
Allies.hasMany(AllyImages, {foreignKey:"ally_id"});
AllyImages.belongsTo(Allies, {foreignKey:"ally_id"});

ListsMaster.hasOne(AllySchedules, {foreignKey:"day_id"});
AllySchedules.belongsTo(ListsMaster, {foreignKey:"day_id"});

//Assists
Users.hasOne(Assists, {foreignKey:"user_id"});
Assists.belongsTo(Users, {foreignKey:"user_id", as: "UserAssist"});
Bicycles.hasOne(Assists, {foreignKey:"bicycle_id"});
Assists.belongsTo(Bicycles, {foreignKey:"bicycle_id"});
Allies.hasOne(Assists, {foreignKey:"ally_id"});
Assists.belongsTo(Allies, {foreignKey:"ally_id"});
Users.hasOne(Assists, {foreignKey:"user_tec_id"});
Assists.belongsTo(Users, {foreignKey:"user_tec_id", as: "TechnicianAssist"});
ListsMaster.hasOne(Assists, {foreignKey:"status_id"});
Assists.belongsTo(ListsMaster, {foreignKey:"status_id", as: "StatusAssist"});
ListsMaster.hasOne(Assists, {foreignKey:"type_id"});
Assists.belongsTo(ListsMaster, {foreignKey:"type_id", as: "TypeAssist"});
AllyRatings.hasOne(Assists, {foreignKey:"rating_id"});
Assists.belongsTo(AllyRatings, {foreignKey:"rating_id"});
Allies.hasMany(AllyRatings, {foreignKey:"ally_id"});
AllyRatings.belongsTo(Allies, {foreignKey:"ally_id"});
Assists.hasMany(AssistImages, {foreignKey:"assist_id"});
AssistImages.belongsTo(AssistImages, {foreignKey:"assist_id"});


//Bicycles
Users.hasMany(Bicycles, {foreignKey:"user_id"});
Bicycles.belongsTo(Users, {foreignKey:"user_id"});
ListsMaster.hasOne(Bicycles, {foreignKey:"material_id"});
Bicycles.belongsTo(ListsMaster, {foreignKey:"material_id", as: "Material"});
ListsMaster.hasOne(Bicycles, {foreignKey:"type_id"});
Bicycles.belongsTo(ListsMaster, {foreignKey:"type_id", as: "Type"});
ListsMaster.hasOne(Bicycles, {foreignKey:"brakes_type_id"});
Bicycles.belongsTo(ListsMaster, {foreignKey:"brakes_type_id", as: "Brakes"});
Bicycles.hasMany(BicycleImages, {foreignKey:"bicycle_id"});
BicycleImages.belongsTo(Bicycles, {foreignKey:"bicycle_id"});

//Maps
Maps.hasMany(MapPoints, { foreignKey: "map_id" });
MapPoints.belongsTo(Maps, { foreignKey: "map_id" });

//Users
Users.hasMany(UserImages, {foreignKey:"user_id"});
UserImages.belongsTo(Users, {foreignKey:"user_id"});

//Recommendations
Recommendations.hasMany(RecommendationMedias, {foreignKey:"rec_id"});
RecommendationMedias.belongsTo(Recommendations, {foreignKey:"rec_id"});

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
