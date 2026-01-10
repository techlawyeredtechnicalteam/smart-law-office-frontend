"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SupportFormValues, supportFormSchema } from "@/types/Support.schema";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SupportComponent() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      email: "",
      message: ""
    }
  });

  const onSubmit = (values: SupportFormValues) => {
    console.log("Support Form Submitted:", values);
    // Simulate API call using Axios:
    // axios.post('/api/v1/support', values)
    //   .then(response => {
    setIsSubmitted(true);
    //   })
    //   .catch(error => {
    //       // Handle error
    //   });
  };

  // Custom input for email that matches the style in the image
  const EmailInput = ({ defaultValue }: { defaultValue: string }) => (
    <div className="relative border-b border-gray-300 focus-within:border-purple-600 pb-1">
      <label
        htmlFor="email"
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-left peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Email
      </label>
      <Input
        id="email"
        type="email"
        placeholder="smartlaw@office.com"
        value={defaultValue} // Using value to replicate the static pre-filled text
        readOnly
        className="w-full h-auto p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800"
      />
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-xl text-center shadow-lg">
          <CardContent className="py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
            <p className="text-gray-600">
              Thank you for reaching out. A member of our support team will
              contact you shortly.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 bg-purple-600 hover:bg-purple-700"
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">Support</h1>

      <div className="flex justify-center">
        <Card className="w-full max-w-xl shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-6 text-center">
              How can we help?
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email Field - Replicates the subtle, pre-filled style of support.png */}
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <EmailInput defaultValue={form.getValues("email")} />
                      </FormControl>
                      {/* Note: In a real app, this should allow user input, but the image shows a static value */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message Field (Textarea) */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Leave us a message..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 h-12"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
