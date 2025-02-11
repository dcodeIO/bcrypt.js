import bcrypt, { hashSync } from "../../index.js";

bcrypt.hashSync("test");
hashSync("test");

export default bcrypt;
