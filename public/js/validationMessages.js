const validationMessage = {
  requiredError(name) {
    return `${name} is a required field.`;
  },
  maxlengthError(name, length) {
    return `${name} must be under ${length} characters.`;
  },
  emailError() {
    return `Please enter a valid email address.`;
  },
  duplicateError(name) {
    return `This ${name} has already been used.`;
  },
  fileFormatError(fileType, fileExtension) {
    return `Uploaded file is not a valid ${fileType}. Only ${fileExtension} files are allowed.`;
  },
  fileSizeError(maxFileSize) {
    return `Please upload file under ${maxFileSize}.`;
  }
};

const getValidationMsg = (v, label) => {
  if (v.required === false) {
    return validationMessage.requiredError(label);
  } else if (v.maxLength === false) {
    return validationMessage.maxlengthError(label, v.$params.maxLength.max)
  } else if(v.email === false) {
    return validationMessage.emailError()
  } else if (v.duplicate === false) {    
    return validationMessage.duplicateError(label)
  }
}
