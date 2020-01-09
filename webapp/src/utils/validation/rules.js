import * as ErrorMessages from "./errorMessage.js";

export const requiredText = text => {
  if (text) {
    return null;
  } else {
    return ErrorMessages.isRequiredText;
  }
};

export const requiredDropdown = text => {
  if (text) {
    return null;
  } else {
    return ErrorMessages.isRequiredDropdown;
  }
};

export const requiredCheckBox = checked => {
  if (checked) {
    return null;
  } else {
    return ErrorMessages.isRequiredCheckBox;
  }
};

export const validEmail = text => {
  if (text) {
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(text.toLowerCase())) {
      return ErrorMessages.isNotValid;
    }
  }
  return null;
};

export const minLength = length => {
  return text => {
    return text.length >= length ? null : ErrorMessages.minLength(length);
  };
};

export const maxLength = length => {
  return text => {
    return text.length <= length ? null : ErrorMessages.maxLength(length);
  };
};

export const validPhoneNumber = text => {
  if (text) {
    var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s]{0,1}[0-9]{3}[-\s]{0,1}[0-9]{4}$/;
    if (!re.test(text.toLowerCase())) {
      return ErrorMessages.isNotValid;
    }
  }
  return null;
};

export const validUsername = text => {
  if (text) {
    if (isNaN(text)) {
      if (validEmail(text)) {
        return ErrorMessages.isNotValidUsername;
      }
    } else if (validPhoneNumber(text)) {
      return ErrorMessages.isNotValidUsername;
    }
  }
  return null;
};

export const validName = text => {
  if (text) {
    var re = /^[-A-Za-z ]+$/;
    if (re.test(text)) {
      return null;
    }
  }
  return ErrorMessages.isNotValid;
};
