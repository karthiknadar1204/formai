"use server";

import type { FormWithSettings } from "@/@types/form.type";
import { defaultBackgroundColor, defaultPrimaryColor } from "@/constant";
import { generateUniqueId } from "@/lib/helper";
import { prisma } from "@/lib/prismadb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { generateEmbeddings, initPinecone } from "@/lib/embeddings";
import { createLogger } from "@/lib/logger";
import { FormBlockInstance } from "@/@types/form-block.type";

const logger = createLogger("form-actions");

export async function fetchFormStats() {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const { _sum, _count } = await prisma.form.aggregate({
      where: { userId: user.id },
      _sum: {
        views: true,
        responses: true,
      },
      _count: {
        id: true,
      },
    });

    const views = _sum.views ?? 0;
    const totalResponses = _sum.responses ?? 0;
    const totalForms = _count?.id ?? 0;

    const conversionRate = views > 0 ? (totalResponses / views) * 100 : 0;
    const engagementRate =
      totalForms > 0 ? (totalResponses / totalForms) * 100 : 0;

    return {
      success: true,
      views,
      totalForms,
      totalResponses,
      conversionRate,
      engagementRate,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function createForm(data: { name: string; description: string }) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const jsonBlocks = JSON.stringify([
      {
        id: generateUniqueId(),
        blockType: "RowLayout",
        attributes: {},
        isLocked: true,
        childblocks: [
          {
            id: generateUniqueId(),
            blockType: "Heading",
            attributes: {
              label: data.name || "Untitled form",
              level: 1,
              fontSize: "4x-large",
              fontWeight: "normal",
            },
          },
          {
            id: generateUniqueId(),
            blockType: "Paragraph",
            attributes: {
              label: "Paragraph",
              text: data.description || "Add a description here.",
              fontSize: "small",
              fontWeight: "normal",
            },
          },
        ],
      },
    ]);

    const formSettings = await prisma.formSettings.create({
      data: {
        primaryColor: defaultPrimaryColor,
        backgroundColor: defaultBackgroundColor,
      },
    });

    const form = await prisma.form.create({
      data: {
        name: data.name,
        description: data.description,
        userId: user.id,
        creatorName: user?.given_name || "",
        settingsId: formSettings.id,
        jsonBlocks,
      },
    });

    if (!form) {
      return {
        success: false,
        message: "Could not create form, please try again",
      };
    }

    return {
      success: true,
      message: "Form created successfully",
      form,
    };
  } catch (e) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function fetchAllForms() {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const form = await prisma.form.findMany({
      where: {
        userId: user.id,
      },
      include: {
        settings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Form fetched successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function saveForm(data: {
  formId: string;
  name?: string;
  description?: string;
  jsonBlocks: string;
}) {
  try {
    const { formId, name, description, jsonBlocks } = data;
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (!formId || !jsonBlocks) {
      return {
        success: false,
        message: "Invalid input data",
      };
    }

    const form = await prisma.form.update({
      where: { formId: formId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        jsonBlocks,
      },
    });

    return {
      success: true,
      message: "Form updated successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while updating the form",
    };
  }
}

export async function updatePublish(formId: string, published: boolean) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (!formId) {
      return {
        success: false,
        message: "FormId is required",
      };
    }

    const form = await prisma.form.update({
      where: { formId },
      data: { published },
    });

    return {
      success: true,
      message: `Form successfully ${published ? "published" : "unpublished"}`,
      published: form.published,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update publish status",
    };
  }
}

export async function fetchPublishFormById(formId: string): Promise<{
  form?: FormWithSettings | null;
  success: boolean;
  message: string;
}> {
  try {
    if (!formId) {
      return {
        success: false,
        message: "FormId is required",
      };
    }
    const form = await prisma.form.findFirst({
      where: {
        formId: formId,
        published: true,
      },
      include: {
        settings: true,
      },
    });

    if (!form) {
      return {
        success: false,
        message: "Form not found",
      };
    }

    return {
      success: true,
      message: "Form fetched successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

// Helper function to prepare response data for embeddings
const prepareResponseForEmbeddings = (
  blocks: FormBlockInstance[],
  responses: { id: string; responseValue: string }
) => {
  const childblockMap = blocks
    .flatMap((block) => block.childblocks || [])
    .reduce((acc, childblock) => {
      if (childblock) {
        acc[childblock.id] = childblock?.attributes?.label || "No label";
      }
      return acc;
    }, {} as Record<string, string>);

  // Create a text representation of Q&A pairs
  return Object.entries(responses)
    .map(([key, value]) => {
      const question = childblockMap[key] || "Unknown Question";
      return `Question: ${question}\nAnswer: ${value}`;
    })
    .join("\n\n");
};

export async function submitResponse(formId: string, response: string) {
  try {
    if (!formId) {
      return {
        success: false,
        message: "FormId is required",
      };
    }

    // Fetch the form to get the blocks
    const form = await prisma.form.findUnique({
      where: { formId },
      select: { jsonBlocks: true },
    });

    if (!form) {
      return {
        success: false,
        message: "Form not found",
      };
    }

    const blocks = JSON.parse(form.jsonBlocks) as FormBlockInstance[];
    const parsedResponse = JSON.parse(response);

    // Generate text for embeddings
    const textForEmbeddings = prepareResponseForEmbeddings(blocks, parsedResponse);

    try {
      // Generate embeddings
      const embedding = await generateEmbeddings(textForEmbeddings);
      
      // Initialize Pinecone
      const pinecone = await initPinecone();
      const index = pinecone.Index("formai");

      // Store in Pinecone with metadata
      await index.upsert([
        {
          id: `${formId}-${Date.now()}`,
          values: embedding,
          metadata: {
            formId,
            responseText: textForEmbeddings,
            timestamp: new Date().toISOString(),
          },
        },
      ]);

      logger.info(`Embeddings stored for form response: ${formId}`);
    } catch (error) {
      logger.error("Failed to store embeddings:", error);
      // Continue with form submission even if embedding fails
    }

    // Store response in database
    await prisma.form.update({
      where: {
        formId: formId,
        published: true,
      },
      data: {
        formResponses: {
          create: {
            jsonReponse: response,
          },
        },
        responses: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: "Response submitted",
    };
  } catch (error) {
    logger.error("Form submission failed:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function fetchAllResponseByFormId(formId: string) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const form = await prisma.form.findUnique({
      where: {
        formId: formId,
      },
      include: {
        formResponses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return {
      success: true,
      message: "Form fetched successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
