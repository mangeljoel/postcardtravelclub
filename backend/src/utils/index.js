const randomString = (length, chars) => {
  let result = "";

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

const generateReferralCode = (prefix) => {
  const randomPart = randomString(4, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  return `${prefix.toUpperCase()}${randomPart}`;
};
