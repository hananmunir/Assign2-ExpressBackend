// validating user data
export const validateUser = (req, res, next) => {
  const { email } = req.body;
  if (!validateEmail(email)) {
    return res.status(409).json({ message: "Invalid Email" });
  }
  next();
};
