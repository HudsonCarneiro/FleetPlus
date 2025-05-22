import React, { useState, useEffect } from "react";
import "../styles/CompanyTable.css";
import {
  handleCompanyDeletion,
  handleFetchAllCompanies,
} from "../controller/CompanyController";
import CompanyModal from "./CompanyModal";
import { toast } from "react-toastify"; 

