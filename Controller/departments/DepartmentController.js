const departmentModel = require("../../Models/departments/DepartmentModel");
const {
  ERROR_MESSAGES,
  RESPONSE_MESSAGES,
  DEPARTMENT_REQUIRED_FIELDS,
} = require("../../Common/Constants");
const { isValidStatus, getMissingFields } = require("../../Common/Validators");
const {
  sendErrorResponse,
  sendSuccessResponse,
  sendCreateSuccessResponse,
} = require("../../Common/Responses");
const STATUS = require("../../Common/StatusCodes");

// Create Department

exports.createDepartment = async (req, res) => {
  const { departmentName } = req.body;

  const missingFields = getMissingFields(req.body, DEPARTMENT_REQUIRED_FIELDS);

  if (missingFields.length > 0) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  try {
    const existingDepartment = await departmentModel.findOne({
      departmentName,
    });

    if (existingDepartment) {
      return sendErrorResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.ALREADY_EXISTS(existingDepartment.departmentName)
      );
    }

    const newDepartment = new departmentModel({
      departmentName,
    });

    await newDepartment.save();

    return sendCreateSuccessResponse(
      res,
      STATUS.CREATED,
      RESPONSE_MESSAGES.CREATION_SUCCESS(departmentName),
      { departmentID: newDepartment.departmentID }
    );
  } catch (error) {
    console.error("Error creating Department:", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.CREATE_FAILED
    );
  }
};

// Departments

exports.getDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.departmentName = { $regex: search, $options: "i" };
    }

    if (status && ["Active", "Inactive"].includes(status)) {
      query.DepartmentStatus = status;
    }

    const totalRecords = await departmentModel.countDocuments(query);

    const DepartmentData = await departmentModel
      .find(query)
      .sort({ createdAt: -1 })
      .select("-_id")
      .skip(skip)
      .limit(limit)
      .lean();

    if (!DepartmentData.length) {
      return sendSuccessResponse(
        res,
        STATUS.OK,
        RESPONSE_MESSAGES.FETCH_NOT_FOUND("Departments"),
        {
          DepartmentData: [],
          pagination: {
            totalRecords: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: limit,
          },
        },
        "DepartmentData"
      );
    }

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.FETCH_SUCCESS("Departments"),
      {
        DepartmentData,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
          pageSize: limit,
        },
      },
      "DepartmentData"
    );
  } catch (error) {
    console.error("Failed to fetch Department Details: ", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.FETCH_FAILED("Department")
    );
  }
};


// Single Department By ID

exports.singleDepartmentByID = async (req, res) => {
  const { departmentID } = req.params;

  if (departmentID.length !== 24) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.ID_NOT_FOUND
    );
  }

  try {
    const DepartmentData = await departmentModel.findOne({ departmentID });

    if (!DepartmentData) {
      return sendErrorResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.NOT_FOUND("Department")
      );
    }

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.FETCH_SUCCESS("Department"),
      DepartmentData,
      "DepartmentData"
    );
  } catch (error) {
    console.error("Failed to fetch Department: ", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.FETCH_FAILED("Department")
    );
  }
};

// Update Department By ID

exports.updateDepartmentByID = async (req, res) => {
  const { departmentID } = req.params;
  const updates = req.body;

  if (departmentID.length !== 24) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.ID_NOT_FOUND
    );
  }

  try {
    const DepartmentData = await departmentModel.findOne({ departmentID });

    if (!DepartmentData) {
      return sendSuccessResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.NOT_FOUND("Department")
      );
    }

    const existingDepartment = await departmentModel.findOne({
      departmentName: updates.departmentName,
      departmentID: { $ne: departmentID },
    });

    if (existingDepartment) {
      return sendErrorResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.ALREADY_EXISTS(existingDepartment.departmentName)
      );
    }

    await departmentModel.findOneAndUpdate(
      { departmentID },
      { $set: updates },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.UPDATE_SUCCESS("Department")
    );
  } catch (error) {
    console.error("Error updating Department:", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.UPDATE_FAILED("Department")
    );
  }
};

// Change Status By ID

exports.changeStatusByID = async (req, res) => {
  const { departmentID } = req.params;
  const { departmentStatus } = req.body;

  if (departmentID.length !== 24) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.ID_NOT_FOUND
    );
  }

  if (!isValidStatus(departmentStatus)) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.INVALID_STATUS
    );
  }

  try {
    const DepartmentData = await departmentModel.findOne({ departmentID });

    if (!DepartmentData) {
      return sendSuccessResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.NOT_FOUND("Department")
      );
    }

    await departmentModel.findOneAndUpdate(
      { departmentID },
      { departmentStatus },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.STATUS_UPDATED_SUCCESS("Department")
    );
  } catch (error) {
    console.error("Failed to update status Department details: ", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.STATUS_UPDATE_FAILED("Department")
    );
  }
};


