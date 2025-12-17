function generatePassword() {
  const length = 8;
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  let password = [
    getRandom(lowerCase),
    getRandom(upperCase),
    getRandom(numbers),
    getRandom(specialChars),
  ];

  const allChars = lowerCase + upperCase + numbers + specialChars;
  for (let i = password.length; i < length; i++) {
    password.push(getRandom(allChars));
  }

  password.sort(() => Math.random() - 0.5);

  return password.join("");
}


function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { generatePassword,generateOtp };
