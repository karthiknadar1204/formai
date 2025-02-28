import { ObjectBlockType } from "@/@types/form-block.type";
import { CalendarBlock } from "@/components/blocks/CalendarBlock";
import { HeadingBlock } from "@/components/blocks/HeadingBlock";
import { MediaBlock } from "@/components/blocks/MediaBlock";
import { ParagraphBlock } from "@/components/blocks/ParagraphBlock";
import { RadioSelectBlock } from "@/components/blocks/RadioSelectBlock";
import { StarRatingBlock } from "@/components/blocks/StarRatingBlock";
import { TextAreaBlock } from "@/components/blocks/TextAreaBlock";
import { TextFieldBlock } from "@/components/blocks/TextField";
import { RowLayoutBlock } from "@/components/blocks/layouts/RowLayout";
import { SelectBlock } from "@/components/blocks/SelectBlock";

export const FormBlocks: Record<string, ObjectBlockType> = {
  TextField: TextFieldBlock,
  TextArea: TextAreaBlock,
  RadioSelect: RadioSelectBlock,
  StarRating: StarRatingBlock,
  Media: MediaBlock,
  Calendar: CalendarBlock,
  Select: SelectBlock,
  Heading: HeadingBlock,
  Paragraph: ParagraphBlock,
  RowLayout: RowLayoutBlock,
};
