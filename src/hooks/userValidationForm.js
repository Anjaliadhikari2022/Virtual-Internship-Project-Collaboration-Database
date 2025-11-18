// src/hooks/userValidationForm.js

// For Signup
export function validateSignupForm({ username, firstName, lastName, email, password, confirmPassword }) {
  const errors = {};
  
  if (!firstName.trim()) errors.firstName = "First name is required";
  if (!lastName.trim()) errors.lastName = "Last name is required";
  if (!username.trim()) errors.username = "Username is required";
  else if (username.length < 3) errors.username = "Username must be at least 3 characters";
  
  if (!email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
  
  if (!password.trim()) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";
  
  if (!confirmPassword.trim()) errors.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  
  return errors;
}

// For Login
export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
  if (!password.trim()) errors.password = "Password is required";
  return errors;
}
