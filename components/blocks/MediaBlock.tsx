import {
  FormBlockInstance,
  FormBlockType,
  FormCategoryType,
  HandleBlurFunc,
  ObjectBlockType,
  NewInstance,
} from "@/@types/form-block.type";
import { ChevronDown, ImageIcon, Trash2Icon, UploadIcon, X } from "lucide-react";
import { Label } from "../ui/label";
import { useBuilder } from "@/context/builder-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";
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
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";

type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Media" as const;

type attributesType = {
  label: string;
  required: boolean;
  acceptedTypes: string[];
  maxFileSize: number;
  mediaUrl?: string;
  mediaType?: string;
};

const propertiesValidateSchema = z.object({
  label: z.string().trim().min(2).max(255),
  required: z.boolean().default(false),
  acceptedTypes: z.array(z.string()),
  maxFileSize: z.number().min(1).max(10), // MB
});

export const MediaBlock: ObjectBlockType = {
  blockCategory,
  blockType,

  createInstance: (id: string) => ({
    id,
    blockType,
    attributes: {
      label: "Upload Media",
      required: false,
      acceptedTypes: ["image/*", "application/pdf"],
      maxFileSize: 5, // 5MB default
      mediaUrl: "",
      mediaType: "",
    },
  }),

  blockBtnElement: {
    icon: ImageIcon,
    label: "Media Upload",
  },

  canvasComponent: MediaCanvasComponent,
  formComponent: MediaFormComponent,
  propertiesComponent: MediaPropertiesComponent,
};

function MediaCanvasComponent({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) {
  const block = blockInstance as NewInstance;
  const { label, required, mediaUrl, mediaType } = block.attributes;

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label className="text-base !font-normal mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {mediaUrl ? (
          <div className="flex flex-col items-center gap-2">
            {mediaType?.startsWith('image/') ? (
              <img src={mediaUrl} alt="Preview" className="max-h-40 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <UploadIcon className="w-6 h-6" />
                <span>File uploaded</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className="w-8 h-8 text-gray-400" />
            <span className="text-gray-500">Drag & drop or click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MediaFormComponent({
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
  const { label, required } = block.attributes;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");

  const onUploadComplete = useCallback(
    (res: { url: string }[]) => {
      const url = res[0].url;
      setMediaUrl(url);
      setMediaType(url.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/*');
      
      if (handleBlur) {
        handleBlur(block.id, url);
      }
    },
    [block.id, handleBlur]
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label
        className={cn(
          "text-base !font-normal mb-2",
          (uploadError || isSubmitError) && "text-red-500"
        )}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div className={cn(
        "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
        isUploading ? "bg-gray-50" : "hover:bg-gray-50",
        uploadError || isSubmitError ? "border-red-500" : "border-gray-300"
      )}>
        {mediaUrl ? (
          <div className="flex flex-col items-center gap-2">
            {mediaType?.startsWith('image/') ? (
              <img src={mediaUrl} alt="Preview" className="max-h-40 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <UploadIcon className="w-6 h-6" />
                <span>File uploaded</span>
              </div>
            )}
          </div>
        ) : (
          <UploadDropzone<OurFileRouter, "mediaUploader">
            endpoint="mediaUploader"
            config={{ mode: "auto" }}
            content={{
              allowedContent: "Image or PDF files up to 4MB",
              button({ ready }) {
                return ready ? "Upload" : "Getting ready...";
              },
            }}
            appearance={{
              container: "border-2 border-dashed p-8",
              allowedContent: "text-sm text-gray-600",
            }}
            onUploadBegin={() => {
              setIsUploading(true);
              setUploadError("");
            }}
            onUploadError={(err) => {
              console.error("Upload error:", err);
              setUploadError(err.message);
              setIsUploading(false);
            }}
            onClientUploadComplete={(res) => {
              if (!res?.[0]?.url) {
                setUploadError("Failed to get upload URL");
                return;
              }
              const url = res[0].url;
              console.log("Upload success, URL:", url);
              setMediaUrl(url);
              setMediaType(url.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/*');
              setIsUploading(false);
              
              if (handleBlur) {
                handleBlur(block.id, url);
              }
            }}
          />
        )}
      </div>

      {uploadError && (
        <p className="text-red-500 text-sm">{uploadError}</p>
      )}
      {errorMessage && !uploadError && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
    </div>
  );
}

function MediaPropertiesComponent({
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
    mode: "onBlur",
    defaultValues: {
      label: block.attributes.label,
      required: block.attributes.required,
      acceptedTypes: block.attributes.acceptedTypes,
      maxFileSize: block.attributes.maxFileSize,
    },
  });

  useEffect(() => {
    form.reset({
      label: block.attributes.label,
      required: block.attributes.required,
      acceptedTypes: block.attributes.acceptedTypes,
      maxFileSize: block.attributes.maxFileSize,
    });
  }, [block.attributes, form]);

  const handleDeleteMedia = async () => {
    if (!parentId || !block.attributes.mediaUrl) return;

    try {
      // Update block attributes
      updateChildBlock(parentId, block.id, {
        ...block,
        attributes: {
          ...block.attributes,
          mediaUrl: "",
          mediaType: "",
        },
      });
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

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
    <div className="w-full pb-4">
      <div className="w-full flex items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
        <span className="text-sm font-medium text-gray-600 tracking-wider">
          Media Upload {positionIndex}
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
                  <FormLabel className="text-[13px] font-normal">
                    Label
                  </FormLabel>
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
            name="required"
            render={({ field }) => (
              <FormItem className="text-end">
                <div className="flex items-baseline justify-between w-full gap-2">
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

          {block.attributes.mediaUrl && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Media</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteMedia}
                className="flex items-center gap-2"
              >
                <Trash2Icon className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
} 