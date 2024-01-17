import FIELD_NAMES from "./fieldNames.js";

/**
 * Valid body for register request.
 */
export const VALID_REGISTER_BODY = {
  [FIELD_NAMES.USERNAME]: "usertest",
  [FIELD_NAMES.EMAIL]: "user@test.com",
  [FIELD_NAMES.PASSWORD]: "usertest1234",
  [FIELD_NAMES.PASSWORD_CONFIRMATION]: "usertest1234",
};

/**
 * Valid body for login request.
 */
export const VALID_LOGIN_BODY = {
  [FIELD_NAMES.EMAIL]: "user@test.com",
  [FIELD_NAMES.PASSWORD]: "usertest1234",
};
