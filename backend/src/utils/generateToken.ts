import jwt from "jsonwebtoken";

export const generateAccessToken = (id: string)=>{
    return jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn:`1m`});
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d", // refresh token lebih lama
  });
};