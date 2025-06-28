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

export const BookSchema = z.object(
  {
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    author: z.string().min(1, "Author is required").max(100, "Author must be less than 100 characters"),
   genre : z.string().min(1, "Genre is required").max(50, "Genre must be less than 50 characters"),
   rating : z.coerce.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
   totalCopies : z.coerce.number().int().positive("Total copies must be a positive number"),
    description: z.string().min(10, "Description is required").max(1000, "Description must be less than 1000 characters"),

    coverUrl: z.string().nonempty("Cover URL is required"),
   coverColor : z.string().trim().regex(/^#([A-Fa-f0-9]{6})$/, "Cover color must be a valid hex color"),
   downloadUrl : z.string().optional(),
   videoUrl : z.string().nonempty("Video URL is required"),
   summary : z.string().trim().min(10, "Minimum 10 characters required")
  }
)