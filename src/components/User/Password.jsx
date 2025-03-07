import bcrypt from 'bcryptjs'

//hash password by via bcryptjs library
export const hashPassword = async (userPwd) => {
  try {
    // Hash the password with bcrypt
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    const hashedPwd = await bcrypt.hash(userPwd, saltRounds);
    return hashedPwd
  } catch (error) {
    console.error('Error registering user:', error);
  }

}
