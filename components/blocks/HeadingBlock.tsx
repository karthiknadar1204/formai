import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ChevronDown, HeadingIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormBlockInstance,
  FormBlockType,
  FormCategoryType,
  ObjectBlockType,
} from "@/@types/form-block.type";
import { fontSizeClass, fontWeightClass } from "@/constant";
import { Input } from "../ui/input";
import { useBuilder } from "@/context/builder-provider";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Heading";

type fontSizeType =
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "2x-large"
  | "4x-large";

type fontWeightType = "normal" | "bold" | "bolder" | "lighter";

type attributesType = {
  label: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize: fontSizeType;
  fontWeight: fontWeightType;
};

type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

const propertiesValidateSchema = z.object({
  label: z.string().trim().min(2).max(255),
  level: z.number().min(1).max(6).default(1),
  fontSize: z
    .enum(["small", "medium", "large", "x-large", "2x-large", "4x-large"])
    .default("medium"),
  fontWeight: z.enum(["normal", "bold", "bolder", "lighter"]).default("normal"),
});

export const HeadingBlock: ObjectBlockType = {
  blockType,
  blockCategory,
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Heading",
      level: 1,
      fontSize: "medium",
      fontWeight: "normal",
    },
  }),
  blockBtnElement: {
    icon: HeadingIcon,
    label: "Heading",
  },
  canvasComponent: HeadingCanvasFormComponent,
  formComponent: HeadingCanvasFormComponent,
  propertiesComponent: HeadingPropertiesComponent,
};

type NewInstance = FormBlockInstance & {
  attributes: attributesType;
};

function HeadingCanvasFormComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewInstance;
  const { level, label, fontSize, fontWeight } = block.attributes;
  return (
    <div
      className={`w-full text-left transition-all duration-200 ease-in-out
         ${fontSizeClass[fontSize]} ${fontWeightClass[fontWeight]} hover:text-primary`}
    >
      {React.createElement(
        `h${level}`,
        {},
        label
      )}
    </div>
  );
}

function HeadingPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewInstance;
  const { updateChildBlock } = useBuilder();

  const form = useForm<propertiesValidateSchemaType>({
    resolver: zodResolver(propertiesValidateSchema),
    defaultValues: {
      label: block.attributes.label,
      fontSize: block.attributes.fontSize,
      fontWeight: block.attributes.fontWeight,
      level: block.attributes.level,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset({
      label: block.attributes.label,
      fontSize: block.attributes.fontSize,
      fontWeight: block.attributes.fontWeight,
      level: block.attributes.level,
    });
  }, [block.attributes, form]);

  function setChanges(values: propertiesValidateSchemaType) {
    if (!parentId) return null;
    updateChildBlock(parentId, block.id, {
      ...block,
      attributes: {
        ...block.attributes,
        ...values,
      },
    });
  }

  return (
    <div className="w-full pb-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gradient-to-r from-gray-50 to-white p-3 border-b border-gray-100 rounded-t-lg">
        <div className="flex items-center gap-2">
          <HeadingIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-gray-700">
            Heading {positionIndex}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full space-y-4 p-4"
        >
          <div className="grid gap-4">
            {/* Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Label
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            label: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Level */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Heading Level
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setChanges({
                            ...form.getValues(),
                            level: Number(value),
                          });
                        }}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <SelectItem key={level} value={level.toString()}>
                              H{level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Font Size */}
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Font Size
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: fontSizeType) => {
                          field.onChange(value);
                          setChanges({
                            ...form.getValues(),
                            fontSize: value,
                          });
                        }}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="x-large">Extra Large</SelectItem>
                          <SelectItem value="2x-large">2x Large</SelectItem>
                          <SelectItem value="4x-large">4x Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Font Weight */}
            <FormField
              control={form.control}
              name="fontWeight"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Font Weight
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: fontWeightType) => {
                          field.onChange(value);
                          setChanges({
                            ...form.getValues(),
                            fontWeight: value,
                          });
                        }}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lighter">Light</SelectItem>
                          <SelectItem value="normal">Regular</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="bolder">Bolder</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
