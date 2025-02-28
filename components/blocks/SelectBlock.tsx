import {
  FormBlockInstance,
  FormBlockType,
  FormCategoryType,
  HandleBlurFunc,
  ObjectBlockType,
} from "@/@types/form-block.type";
import { ChevronDown, ListIcon, PlusCircle, X } from "lucide-react";
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
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Select";

type attributesType = {
  label: string;
  helperText: string;
  required: boolean;
  placeholder: string;
  options: string[];
  allowMultiple: boolean;
};

const propertiesValidateSchema = z.object({
  label: z.string().trim().min(2).max(255),
  helperText: z.string().trim().max(255).optional(),
  required: z.boolean().default(false),
  placeholder: z.string().trim().optional(),
  options: z.array(z.string()).min(1, "At least one option is required"),
  allowMultiple: z.boolean().default(false),
});

export const SelectBlock: ObjectBlockType = {
  blockCategory,
  blockType,
  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Dropdown Selection",
      helperText: "",
      required: false,
      placeholder: "Select an option",
      options: ["Option 1"],
      allowMultiple: false,
    },
  }),
  blockBtnElement: {
    icon: ListIcon,
    label: "Dropdown",
  },
  canvasComponent: SelectCanvasComponent,
  formComponent: SelectFormComponent,
  propertiesComponent: SelectPropertiesComponent,
};

function SelectCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as any;
  const { label, helperText, required, placeholder, options } = block.attributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-base !font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: string, index: number) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function SelectFormComponent({
  blockInstance,
  handleBlur,
  isError,
  errorMessage,
}: {
  blockInstance: FormBlockInstance;
  handleBlur?: HandleBlurFunc;
  isError?: boolean;
  errorMessage?: string;
}) {
  const block = blockInstance as any;
  const { label, helperText, required, placeholder, options, allowMultiple } =
    block.attributes;

  const [value, setValue] = useState<string>("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (handleBlur) {
      handleBlur(block.id, newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`text-base !font-normal mb-2 ${
          isError ? "text-red-500" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={isError ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: string, index: number) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
      {isError && required && !value && (
        <p className="text-red-500 text-[0.8rem]">This field is required</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-[0.8rem]">{errorMessage}</p>
      )}
    </div>
  );
}

function SelectPropertiesComponent({
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
  const [newOption, setNewOption] = useState("");

  const form = useForm<z.infer<typeof propertiesValidateSchema>>({
    resolver: zodResolver(propertiesValidateSchema),
    mode: "onBlur",
    defaultValues: {
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeholder: block.attributes.placeholder,
      options: block.attributes.options,
      allowMultiple: block.attributes.allowMultiple,
    },
  });

  useEffect(() => {
    form.reset({
      label: block.attributes.label,
      helperText: block.attributes.helperText,
      required: block.attributes.required,
      placeholder: block.attributes.placeholder,
      options: block.attributes.options,
      allowMultiple: block.attributes.allowMultiple,
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

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...form.getValues().options, newOption.trim()];
      form.setValue("options", updatedOptions);
      setChanges({ ...form.getValues(), options: updatedOptions });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = form.getValues().options.filter((_, i) => i !== index);
    form.setValue("options", updatedOptions);
    setChanges({ ...form.getValues(), options: updatedOptions });
  };

  return (
    <div className="w-full pb-4">
      <div className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Dropdown {positionIndex}
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

          <div className="space-y-2">
            <Label className="text-[13px] font-normal">Options</Label>
            <div className="flex gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOption}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {form.getValues().options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={option} disabled />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="allowMultiple"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-center justify-between w-full gap-2">
                  <FormLabel className="text-[13px] font-normal">
                    Allow Multiple
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        setChanges({
                          ...form.getValues(),
                          allowMultiple: value,
                        });
                      }}
                    />
                  </FormControl>
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