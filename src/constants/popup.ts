import type { IPopUpData } from "../types/ui";
import { imageHandler } from "../utils/image-url";

export const data: IPopUpData[] = [
  {
    title: "Win Oppo",
    image: imageHandler(
      "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/popup-banner-2/public"  
    ),
    id: "wheel",
  },
  {
    title: "Free 1000 Bonus",
    image: imageHandler(
      "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/popup-banner-3/public"
    ),
    id: "lucky-spin",
  },
  {
    title: "Refer & Earn",
    image: imageHandler(
      "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/popup-banner-1/public"
    ),
    id: "invite",
  },
];
