import { z } from "zod";

export const SignUpSchema =  z.object({
fullName: z.string().min(1, "Full name is required"),
 email: z.string().email("Invalid email address"),
 universityId: z.coerce.number().min(1, "University ID is required").int("University ID must be a valid number"),
 password: z.string().min(8, "Password must be at least 8 characters long"),
 universityCard : z.string().nonempty("University card is required")

});


export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});