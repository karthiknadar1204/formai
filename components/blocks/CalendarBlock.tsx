import {
  FormBlockInstance,
  FormBlockType,
  FormCategoryType,
  HandleBlurFunc,
  ObjectBlockType,
} from "@/@types/form-block.type";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Label } from "../ui/label";
import { useBuilder } from "@/context/builder-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Calendar";

type attributesType = {
  label: string;
  helperText: string;
  required: boolean;
  placeholder: string;
};

const propertiesValidateSchema = z.object({
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  helperText: z.string().trim().max(255).optional(),
  placeholder: z.string().trim().optional(),
});

export const CalendarBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Date Selection",
      helperText: "",
      required: false,
      placeholder: "Select a date",
    },
  }),
  blockBtnElement: {
    icon: CalendarIcon,
    label: "Calendar",
  },
  canvasComponent: CalendarCanvasComponent,
  formComponent: CalendarFormComponent,
  propertiesComponent: CalendarPropertiesComponent,
};

function CalendarCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as any;
  const { label, helperText, required, placeholder } = block.attributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base !font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal !cursor-default",
          !placeholder && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {placeholder}
      </Button>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function CalendarFormComponent({
  blockInstance,
  handleBlur,
  isError: isSubmitError,
  errorMessage,
}: {
  blockInstance: FormBlockInstance;
  handleBlur?: HandleBlurFunc;
  isError?: boolean;
  errorMessage?: string;
}) {
  const block = blockInstance as any;
  const { label, helperText, required, placeholder } = block.attributes;

  const [date, setDate] = useState<Date>();
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const validateField = (value: Date | undefined) => {
    if (required) {
      return value !== undefined;
    }
    return true;
  };

  const handleDateSelect = (value: Date | undefined) => {
    setDate(value);
    setIsOpen(false);
    const isValid = validateField(value);
    setIsError(!isValid);

    if (handleBlur && value) {
      handleBlur(block.id, value.toISOString());
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base !font-normal mb-2 ${
          isError || isSubmitError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              (isError || isSubmitError) && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
      {isError || isSubmitError ? (
        <p className="text-red-500 text-[0.8rem]">
          {required && !date ? "This field is required." : ""}
        </p>
      ) : (
        errorMessage && (
          <p className="text-red-500 text-[0.8rem]">{errorMessage}</p>
        )
      )}
    </div>
  );
}

function CalendarPropertiesComponent({
  positionIndex,
  parentId,
  blockInstance,
}: {
  positionIndex?: number;
  parentId?: string;
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as any;
  const { updateChildBlock } = useBuilder();

  const form = useForm<z.infer<typeof propertiesValidateSchema>>({
    resolver: zodResolver(propertiesValidateSchema),
    mode: "onBlur",
    defaultValues: {
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeholder: block.attributes.placeholder,
    },
  });

  useEffect(() => {
    form.reset({
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeholder: block.attributes.placeholder,
    });
  }, [block.attributes, form]);

  function setChanges(values: z.infer<typeof propertiesValidateSchema>) {
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
    <div className="w-full pb-4">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Calendar {positionIndex}
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full space-y-3 px-4"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Label</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
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
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="helperText"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">Note</FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            helperText: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="placeholder"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">
                    Placeholder
                  </FormLabel>
                  <div className="w-full max-w-[187px]">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            placeholder: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">
                    Required
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        setChanges({
                          ...form.getValues(),
                          required: value,
                        });
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 