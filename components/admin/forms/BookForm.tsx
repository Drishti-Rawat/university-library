"use client";
import React, { useState } from "react";
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
import { createBook } from "@/lib/admin/actions/book";

interface Props extends Partial<Book> {
  type: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form: UseFormReturn<z.infer<typeof BookSchema>> = useForm({
    resolver: zodResolver(BookSchema),
    defaultValues: {
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
    },
  });

  const onSubmit = async (data: z.infer<typeof BookSchema>) => {
     
    const result = await createBook(data);
    if(result.success){
      toast.success("Book created successfully!");
      router.push(`/admin/books/${result.data.id}`);
    }
    else{
        toast.error(result.error || "An error occurred. Please try again.");
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          {/* title */}
          <FormField
            control={form.control}
            name={"title"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    disabled={isSubmitting}
                    {...field}
                    placeholder={`Enter the book title`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* author */}
          <FormField
            control={form.control}
            name={"author"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
                  Author
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    disabled={isSubmitting}
                    {...field}
                    placeholder={`Enter the book author`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* genre */}
          <FormField
            control={form.control}
            name={"genre"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
                  Genre
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    disabled={isSubmitting}
                    {...field}
                    placeholder={`Enter the book genre`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"rating"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
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
                    placeholder={`Enter the book genre`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* totalCopies */}
          <FormField
            control={form.control}
            name={"totalCopies"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
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
                    placeholder={`Enter the total number of books`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* cover image */}

          <FormField
            control={form.control}
            name={"coverUrl"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* cover color */}
          <FormField
            control={form.control}
            name={"coverColor"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
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

          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-14 w-full  text-dark-500 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    rows={10}
                    disabled={isSubmitting}
                    {...field}
                    placeholder={`Enter the book description`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"videoUrl"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"downloadUrl"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
                  Book Pdf URL
                </FormLabel>
                <FormControl>
                 <Input
                    className="min-h-14 border text-dark-500 border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                  
                    type ="url"
                    disabled={isSubmitting}
                    {...field}
                    placeholder={`Enter the book pdf url`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"summary"}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-dark-500  font-normal text-base">
                  Summary
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-14 w-full border text-dark-500  border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                    required
                    rows={10}
                    disabled={isSubmitting}
                    {...field}
                    placeholder={`Enter the book summary`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-14 w-full bg-primary-admin hover:bg-primary-admin/95 text-white"
          >
            submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BookForm;
