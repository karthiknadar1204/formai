import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" }
  })
    .middleware(() => {
      return { userId: "guest" }; // Allow uploads without auth for now
    })
    .onUploadComplete((res) => {
      console.log("Upload complete", res);
      return { url: res.file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 