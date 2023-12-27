const currentDate = () => {
  const date = new Date();
  const currentdate = date.getDate();
  const currentmonth = date.getMonth()+1;
  const currentyear = date.getFullYear();
  return `${currentdate}/${currentmonth}/${currentyear}`;
};
const currentTime = (railtime = false) => {
    const date = new Date();
    const currentHour = date.getHours();
    const currentMint = date.getMinutes();
    let currentsec =
      date.getSeconds() > 9 ? date.getSeconds() : 0 + date.getSeconds();
    if (currentsec <= 9) {
      currentsec = 0 + currentsec.toString();
    }
    if (railtime) {
      return `${currentHour}:${currentMint}:${currentsec}`;
    } else {
      return `${
        currentHour > 12 ? currentHour % 12 : currentHour
      }:${currentMint}:${currentsec} ${currentHour > 11 ? "PM" : "AM"}`;
    }
  };
  const covert12Hour=(time24hr)=> {
    // Validate input format
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(time24hr)) {
      return "Invalid time format. Please use HH:mm:ss (24-hour format).";
    }
  
    // Parse hours, minutes, and seconds
    const [hours, minutes, seconds] = time24hr.split(':');
    let period = 'AM';
  
    // Convert to 12-hour format
    let hours12 = parseInt(hours, 10);
    if (hours12 >= 12) {
      period = 'PM';
      if (hours12 > 12) {
        hours12 -= 12;
      }
    }
  
    // Add leading zero if necessary
    const hoursStr = hours12 < 10 ? `0${hours12}` : hours12;
  
    // Construct the 12-hour time format
    const time12hr = ` ${hoursStr}:${minutes} ${period}`;
  
    return time12hr;
  }
  const getDayWithDate=(dateString)=> {
    // Create a new Date object from the provided string
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date format. Please provide a valid date.";
    }
  
    // Get day and format it
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
  
    // Get the date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
  
    // Construct the result string
    const result = `${dayOfWeek} ${month}/${day}/${year}`;
  
    return result;
  } 
  
export { currentDate,currentTime,covert12Hour,getDayWithDate };
