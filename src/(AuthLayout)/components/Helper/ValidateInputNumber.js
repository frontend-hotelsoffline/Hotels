export const handleKeyPress = (e) => {
    // Allow only digits (0-9) and the Backspace key
    const isValidInput = /^[0-9\b]+$/.test(e.key);
    if (!isValidInput) {
      e.preventDefault();
    }
  };