import type { IPopUpData } from "../types/ui";
import { imageHandler } from "../utils/image-url";

export const data: IPopUpData[] = [
  {
    title: "Win Oppo",
    image: imageHandler(
      "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/imageupload/public" 
    ),
    id: "wheel",
  },
  {
    title: "Free Spin Bonus",
    image: imageHandler(
     "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/testing/public"
    ),
    id: "rise-of-seth",
  },
  {
    title: "Refer & Earn",
    image: imageHandler(
      "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/a93bb0c8-8baa-4e63-ae19-7cb04a652300/public"
    ),
    id: "invite",
  },
];
