export function isUserEmailInArray(userEmail, dataArray) {
    // Flatten the nested array
    const flatArray = dataArray.flat();
  
    // Check if user's email matches any email in the array
    return flatArray.some((item) => item.email === userEmail);
  }
  