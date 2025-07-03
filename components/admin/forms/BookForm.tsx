"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BookSchema } from "@/lib/Validation";
import FileUpload from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import ColorPicker from "../ColorPicker";
import { createBook, updateBook, getBookById } from "@/lib/admin/actions/book";

interface Book {
  id?: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  description: string;
  coverUrl: string;
  coverColor: string;
  downloadUrl: string;
  videoUrl: string;
  summary: string;
}

interface Props extends Partial<Book> {
  type: "create" | "update";
  bookId?: string; // For update operations
}

const BookForm = ({ type, bookId, ...book }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    title: "",
    author: "",
    genre: "",
    rating: 1,
    totalCopies: 1,
    description: "",
    coverUrl: "",
    coverColor: "",
    downloadUrl: "",
    videoUrl: "",
    summary: "",
  };

  const form: UseFormReturn<z.infer<typeof BookSchema>> = useForm({
    resolver: zodResolver(BookSchema),
    defaultValues,
  });

  // Fetch book data for update mode
  useEffect(() => {
    const fetchBookData = async () => {
      if (type === "update" && bookId) {
        setIsLoading(true);
        try {
          const result = await getBookById(bookId);
          if (result.success && result.data) {
            // Reset form with fetched data
            form.reset({
              title: result.data.title || "",
              author: result.data.author || "",
              genre: result.data.genre || "",
              rating: result.data.rating || 1,
              totalCopies: result.data.totalCopies || 1,
              description: result.data.description || "",
              coverUrl: result.data.coverUrl || "",
              coverColor: result.data.coverColor || "",
              downloadUrl: result.data.downloadUrl || "",
              videoUrl: result.data.videoUrl || "",
              summary: result.data.summary || "",
            });
          } else {
            toast.error("Failed to fetch book data");
            router.push("/admin/books");
          }
        } catch (error) {
          toast.error("Error loading book data");
          router.push("/admin/books");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookData();
  }, [type, bookId, form, router]);

  // Alternative: If book data is passed as props
  useEffect(() => {
    if (type === "update" && book && Object.keys(book).length > 0) {
      form.reset({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        rating: book.rating || 1,
        totalCopies: book.totalCopies || 1,
        description: book.description || "",
        coverUrl: book.coverUrl || "",
        coverColor: book.coverColor || "",
        downloadUrl: book.downloadUrl || "",
        videoUrl: book.videoUrl || "",
        summary: book.summary || "",
      });
    }
  }, [type, book, form]);

  const onSubmit = async (data: z.infer<typeof BookSchema>) => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (type === "create") {
        result = await createBook(data);
        if (result.success) {
          toast.success("Book created successfully!");
          router.push(`/admin/books/${result.data.id}`);
        } else {
          toast.error(result.error || "Failed to create book. Please try again.");
        }
      } else if (type === "update" && bookId) {
        result = await updateBook(bookId, data);
        if (result.success) {
          toast.success("Book updated successfully!");
          router.push(`/admin/books/${bookId}`);
        } else {
          toast.error(result.error || "Failed to update book. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching data
 if (type === "update" && isLoading) {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-10 bg-gray-300 rounded-md animate-pulse w-full mt-4" />
      </div>
    </div>
  );
}


  return (
    <div>
     

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter the book title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Author
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter the book author"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Genre */}
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Genre
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter the book genre"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Rating
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    type="number"
                    min={1}
                    max={5}
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    placeholder="Enter rating (1-5)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Copies */}
          <FormField
            control={form.control}
            name="totalCopies"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Total number of Books
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    type="number"
                    min={1}
                    max={1000}
                    disabled={isSubmitting}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    placeholder="Enter the total number of books"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image */}
          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Book Image
                </FormLabel>
                <FormControl>
                  <FileUpload
                    type="image"
                    accept="image/*"
                    placeholder="Upload cover image"
                    folder="ids"
                    variant="light"
                    onFileChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Color */}
          <FormField
            control={form.control}
            name="coverColor"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Primary Color
                </FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onPickerChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-14 w-full text-dark-500 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    rows={10}
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter the book description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Video URL */}
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Book Trailer
                </FormLabel>
                <FormControl>
                  <FileUpload
                    type="video"
                    accept="video/*"
                    placeholder="Upload Book trailer"
                    folder="ids"
                    variant="light"
                    onFileChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Download URL */}
          <FormField
            control={form.control}
            name="downloadUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Book PDF URL
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    type="url"
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter the book PDF URL"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Summary */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500 font-normal text-base">
                  Summary
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-14 w-full border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    rows={10}
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter the book summary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="min-h-14 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-h-14 flex-1 bg-primary-admin hover:bg-primary-admin/95 text-white"
            >
              {isSubmitting 
                ? (type === "create" ? "Creating..." : "Updating...") 
                : (type === "create" ? "Create Book" : "Update Book")
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookForm;