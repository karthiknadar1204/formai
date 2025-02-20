import {
    FormBlockInstance,
    FormBlockType,
    FormCategoryType,
    HandleBlurFunc,
    ObjectBlockType,
  } from "@/@types/form-block.type";
  import { ChevronDown, CircleIcon, X } from "lucide-react";
  import { Label } from "../ui/label";
  import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
  import { Button } from "../ui/button";
  import { Switch } from "../ui/switch";
  import { generateUniqueId } from "@/lib/helper";
  
  const blockCategory: FormCategoryType = "Field";
  const blockType: FormBlockType = "RadioSelect";
  
  type attributesType = {
    label: string;
    options: string[];
    required: boolean;
    allowMultiple: boolean;
  };
  
  type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;
  
  const propertiesValidateSchema = z.object({
    label: z.string().trim().min(2).max(255),
    required: z.boolean().default(false),
    options: z.array(z.string().min(1)),
    allowMultiple: z.boolean().default(false),
  });
  
  export const RadioSelectBlock: ObjectBlockType = {
    blockCategory,
    blockType,
  
    createInstance: (id: string) => ({
      id,
      blockType,
      attributes: {
        label: "Select an option",
        options: ["Option 1", "Option 2"],
        required: false,
        allowMultiple: false,
      },
    }),
  
    blockBtnElement: {
      icon: CircleIcon,
      label: "Radio",
    },
  
    canvasComponent: RadioSelectCanvasComponent,
    formComponent: RadioSelectFormComponent,
    propertiesComponent: RadioSelectPropertiesComponent,
  };
  
  type NewInstance = FormBlockInstance & {
    attributes: attributesType;
  };
  
  function RadioSelectCanvasComponent({
    blockInstance,
  }: {
    blockInstance: FormBlockInstance;
  }) {
    const block = blockInstance as NewInstance;
    const { label, options, required, allowMultiple } = block.attributes;
  
    return (
      <div className="flex flex-col gap-3 w-full">
        <Label className="text-base !font-normal mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
  
        <div className="space-y-3">
          {options?.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`flex h-4 w-4 shrink-0 rounded-${
                  allowMultiple ? 'sm' : 'full'
                } border border-primary disabled:cursor-default`}
              />
              <Label htmlFor={option} className="!font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  function RadioSelectFormComponent({
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
    const block = blockInstance as NewInstance;
    const { label, options, required, allowMultiple } = block.attributes;
  
    const [values, setValues] = useState<string[]>([]);
    const [isError, setIsError] = useState(false);
  
    const validateField = (vals: string[]) => {
      if (required) {
        return vals.length > 0;
      }
      return true;
    };
  
    const handleValueChange = (value: string) => {
      let newValues: string[];
      if (allowMultiple) {
        // Toggle value in array for multiple selection
        newValues = values.includes(value)
          ? values.filter(v => v !== value)
          : [...values, value];
      } else {
        // Single selection
        newValues = [value];
      }
      
      setValues(newValues);
      const isValid = validateField(newValues);
      setIsError(!isValid);
      
      if (handleBlur) {
        handleBlur(block.id, newValues.join(','));
      }
    };
  
    return (
      <div className="flex flex-col gap-3 w-full">
        <Label
          className={`text-base !font-normal mb-2 ${
            isError || isSubmitError ? "text-red-500" : ""
          }`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
  
        <div className="space-y-3">
          {options?.map((option: string, index: number) => {
            const uniqueId = `option-${generateUniqueId()}`;
            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className={`flex h-4 w-4 shrink-0 rounded-${
                    allowMultiple ? 'sm' : 'full'
                  } border border-primary ${
                    values.includes(option)
                      ? "bg-primary text-primary-foreground"
                      : "border-primary"
                  } ${isError || isSubmitError ? "!border-red-500" : ""}`}
                  onClick={() => handleValueChange(option)}
                >
                  {values.includes(option) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <Label
                  htmlFor={uniqueId}
                  className="!font-normal !cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
  
        {isError ? (
          <p className="text-red-500 text-[0.8rem]">
            {required && values.length === 0 ? "This field is required" : ""}
          </p>
        ) : (
          errorMessage && (
            <p className="text-red-500 text-[0.8rem]">{errorMessage}</p>
          )
        )}
      </div>
    );
  }
  
  function RadioSelectPropertiesComponent({
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
  
    // Define form schema and validation
    const form = useForm<propertiesValidateSchemaType>({
      resolver: zodResolver(propertiesValidateSchema),
      mode: "onBlur",
      defaultValues: {
        label: block.attributes.label,
        required: block.attributes.required,
        options: block.attributes.options || [],
        allowMultiple: block.attributes.allowMultiple,
      },
    });
  
    // Reset form values when block attributes change
    useEffect(() => {
      form.reset({
        label: block.attributes.label,
        required: block.attributes.required,
        options: block.attributes.options || [],
        allowMultiple: block.attributes.allowMultiple,
      });
    }, [block.attributes, form]);
  
    function setChanges(values: propertiesValidateSchemaType) {
      if (!parentId) return null;
  
      //Update ChildBlock
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
        <div
          className="w-full flex items-center
       justify-between gap-1 bg-gray-100 h-auto
       p-1 px-2 mb-[10px]
      "
        >
          <span
            className="
            text-sm font-medium text-gray-600
            tracking-wider
          "
          >
            Radio {positionIndex}
          </span>
          <ChevronDown className="w-4 h-4" />
        </div>
  
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full space-y-3 px-4"
          >
            {/* Label Field */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="text-end">
                  <div
                    className="flex items-baseline
                    justify-between w-full gap-2"
                  >
                    <FormLabel className="text-[13px] font-normal">
                      Label
                    </FormLabel>
                    <div className="w-full max-w-[187px]">
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setChanges({
                            ...form.getValues(),
                            label: e.target.value,
                          });
                        }}
                        // onKeyDown={(event) => {
                        //   if(event.key === "Enter") event.currentTarget
                        // }}
                      />
                    </div>
                  </div>
                </FormItem>
              )}
            />
  
            {/* Options Field */}
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem className="text-end">
                  <div
                    className="flex items-baseline
                    justify-between w-full gap-2"
                  >
                    <FormLabel className="text-[13px] font-normal">
                      Options
                    </FormLabel>
                    <div className="flex flex-col gap-1">
                      {field?.value?.map((option: string, index: number) => (
                        <div
                          key={index}
                          className="relative flex items-center
                        justify-between gap-2
                          "
                        >
                          <Input
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...(field.value || [])];
                              updatedOptions[index] = e.target.value;
                              field.onChange(updatedOptions);
                              setChanges({
                                ...form.getValues(),
                                options: updatedOptions,
                              });
                            }}
                            className="max-w-[187px]"
                          />
  
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="
                              !p-0 absolute -right-1 -top-1
                              !bg-black rounded-full
                              w-4 h-4
                            "
                            onClick={() => {
                              const updatedOptions = field.value?.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(updatedOptions);
                              setChanges({
                                ...form.getValues(),
                                options: updatedOptions,
                              });
                            }}
                          >
                            <X color="white" className="!w-2.5 !h-2.5" />
                          </Button>
                        </div>
                      ))}
  
                      <FormMessage />
  
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        size="sm"
                        onClick={() => {
                          const currentOptions = field?.value || [];
                          const newOption = `Option ${currentOptions.length + 1}`;
                          const updatedOptions = [...currentOptions, newOption];
                          field.onChange(updatedOptions);
                          setChanges({
                            ...form.getValues(),
                            options: updatedOptions,
                          });
                        }}
                      >
                        Add Option
                      </Button>
                    </div>
                  </div>
                </FormItem>
              )}
            />
  
            {/* Allow Multiple Selections Field */}
            <FormField
              control={form.control}
              name="allowMultiple"
              render={({ field }) => (
                <FormItem className="text-end">
                  <div className="flex items-center justify-between w-full gap-2">
                    <FormLabel className="text-[13px] font-normal">
                      Allow Multiple Selections
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
  
            {/* Required Field */}
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="text-end">
                  <div
                    className="flex items-baseline
                    justify-between w-full gap-2"
                  >
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
  