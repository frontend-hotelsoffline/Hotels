export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  
    // Convert the first character of the month to uppercase
    const uppercaseMonth = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
    return uppercaseMonth;
  };