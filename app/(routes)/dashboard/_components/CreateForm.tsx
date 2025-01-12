"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createForm } from "@/actions/form.action";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CreateForm = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await createForm({
      name: values.name,
      description: values.description,
    });

    if (response.success) {
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      router.push(`/dashboard/form/builder/${response.form?.formId}`);
    } else {
      toast({
        title: "Error",
        description: response?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="!bg-primary !font-medium gap-1">
            <PlusIcon />
            Create a form
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              This will create a new form. Ensure all details are accurate.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Form name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Form description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full !bg-primary"
                >
                  {form.formState.isSubmitting && (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Create
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateForm;