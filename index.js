require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");


const employeeRoutes = require("./routes/employee_routes");
const assetRoutes = require("./routes/asset_routes");
const assetCategoryRoutes = require("./routes/asset_category_routes");
const assetOpsRoutes = require("./routes/asset_ops");

const app = express();
const PORT = process.env.PORT || 8080


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => res.redirect("/assets"));
app.get("/assets", (req, res) => res.render("assets"));
app.get("/employees", (req, res) => res.render("employees"));
app.get("/issue", (req, res) => res.render("issue"));
app.get("/return", (req, res) => res.render("return"));
app.get("/scrap", (req, res) => res.render("scrap"));
app.get("/stock", (req, res) => res.render("stock"));
app.get("/history", (req, res) => res.render("history"));


const apiRouter = express.Router();
apiRouter.use("/employees", employeeRoutes);
apiRouter.use("/assets", assetRoutes);
apiRouter.use("/category", assetCategoryRoutes);
apiRouter.use("/ops", assetOpsRoutes);

app.use("/api", apiRouter);



sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Models synchronized...");

    app.listen(PORT, () =>
      console.log(`Server running successfully → http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("DB Error:", err));





