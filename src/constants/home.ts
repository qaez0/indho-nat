import { ICarousel } from '../types/ui';
import { imageHandler } from '../utils/image-url';
import i18n from 'i18next';

export const getBannerData = (): ICarousel[] => {
  const language = i18n.language;
  const isPk = language === "pk";
  
  return [
    // {
    //   id: 0,
    //   image: require('../assets/common/home/feature-banner/t20homepage.webp'),
    //   nav: 'promotions',
    // },
    ...(isPk
      ? [
          {
            id: 0,
            nav: "promotions",
            image: imageHandler(
              "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner5/public"
            ),
          },
        ]
      : []),
    {
      id: 1,
      nav: "promotions",
      image: isPk
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner2/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_100%25_banner1/public"
          ),
    },
    {
      id: 2,
      nav: "promotions",
      image: isPk
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage-banner-urdu/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage-banner-eng/public"
          ),
    },
    {
      id: 3,
      nav: "promotions",
      image: isPk
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner4/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_vip_banner3/public"
          ),
    },
    {
      id: 4,
      nav: "promotions",
      image: isPk
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage-megawinjackpot-ban/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage-megawin-jackpot/public"
          ),
    },
    {
      id: 5,
      nav: "promotions",
      image: isPk
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner3/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_T20_banner2/public"
          ),
    },
    {
      id: 6,
      nav: "promotions",
      image: isPk
        ? imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage-superwin-ban/public"
          )
        : imageHandler(
            "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage-superwin-jili/public"
          ),
    },
    ...(isPk
      ? [
          {
            id: 7,
            nav: "promotions",
            image: imageHandler(
              "/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/homepage_banner1/public"
            ),
          },
        ]
      : []),
  ];
};
