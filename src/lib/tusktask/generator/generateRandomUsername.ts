const generateRandomUsername = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `user_${randomNum}`;
};

export default generateRandomUsername;
