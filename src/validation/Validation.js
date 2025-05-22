// This function performs validation on the input values provided and returns an object containing any errors found during the validation process.
export default function Validation(values) {
  // Initialize an empty object to store validation errors.
  const errors = {};

  // Regular expressions used for validating email, password, alphabetic input, and phone number.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email input
  if (!values.emailId) {
    errors.emailId = "Email is Required";
  } else if (!emailRegex.test(values.emailId)) {
    errors.emailId = "Must be a valid email ID";
  }

  // Validate password input
  if (values.password === "") {
    errors.password = "Password is Required";
  }
  if (values?.firstRegimenList?.length === 0) {
    errors.firstRegimenList = "Product is Required";
  }
  if (!values.regimenCategory) {
    errors.regimenCategory = "Regimen Category is Required";
  }
  if (
    values.conditions &&
    values?.conditions?.some(
      (condition) => !condition?.selectedProducts?.length
    )
  ) {
    const newErrors = values.conditions.map((condition, index) =>
      condition?.selectedProducts.length === 0 ? "Product is Required" : ""
    );
    errors.conditions = newErrors;
  }

    if (values?.firstSegmentList?.length === 0) {
      errors.firstSegmentList = "Product is Required";
    }
    if (!values.segmentCategory) {
      errors.segmentCategory = "Segment Category is Required";
    }
    if (
      values.conditionsSegment &&
      values?.conditionsSegment?.some(
        (condition) => !condition?.selectedProducts?.length
      )
    ) {
      const newErrors = values.conditionsSegment.map((condition, index) =>
        condition?.selectedProducts.length === 0 ? "Product is Required" : ""
      );
      errors.conditionsSegment = newErrors;
    }

    if (values?.testingCodes?.length===0){
      errors.testingCodes="Please select a Testing Code"
    } 
    
    if (!values?.testingType) {
      errors.testingType = "Please enter a Group By Name";
    } 
  // Return the object containing any errors found during validation
  return errors;
}
