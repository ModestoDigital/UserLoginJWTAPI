"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./db");

const app = express();

const activitiesRoutes = require("./src/endpoints/activities/routes");
const authRoutes = require("./src/endpoints/auth/routes");
const clientCompanyRoutes = require("./src/endpoints/clientCompany/routes");
const clientContactRoutes = require("./src/endpoints/clientContact/routes");
const companyRoutes = require("./src/endpoints/company/routes");
const leadRoutes = require("./src/endpoints/lead/routes");
const optionsAndCustomFieldsRoutes = require("./src/endpoints/optionsAndCustomFields/routes");
const pipelineRoutes = require("./src/endpoints/pipelines/routes");
const qualificationFormsRoutes = require("./src/endpoints/qualificationForms/routes");
const qualificationResultsRoutes = require("./src/endpoints/qualificationResults/routes");
const userRoutes = require("./src/endpoints/user/routes");

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

// *****Routes*****

//Activities
app.use("/activities", activitiesRoutes);

//Auth
app.use("/auth", authRoutes);

//clientCompany
app.use("/clientCompany", clientCompanyRoutes);

//clientContact
app.use("/clientContact", clientContactRoutes);

//company
app.use("/company", companyRoutes);

//Lead
app.use("/lead", leadRoutes);

//optionsAndCustomFields
app.use("/optionsAndCustomFields", optionsAndCustomFieldsRoutes);

//pipelines
app.use("/pipelines", pipelineRoutes);

//qualificationForms
app.use("/qualificationForms", qualificationFormsRoutes);

//qualificationResults
app.use("/qualificationResults", qualificationResultsRoutes);

//user
app.use("/user", userRoutes);

// ****port****
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});

//Connect to db
db.connect();
