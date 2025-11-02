import type { GetImageResult } from 'astro';
import { getImage } from 'astro:assets';
import path from 'path';

interface ImageProps {
  image: GetImageResult;
  cssUrl: string;
  cssImageSet: string;
}

interface ConvertedImage {
  png: ImageProps;
  avif: ImageProps;
}

/** This is SO ERROR PRONE AND SHOULD BE REFACTORED **/
export const convertImages = async (imageSrcs: ImageMetadata[]) => {
  const images = {} as Record<string, ConvertedImage>;

  for (const imageSrc of imageSrcs) {
    // Remove all after file name
    const imageName = path.basename(imageSrc.src).split('.')[0];

    const png = await getImage({
      src: imageSrc,
      format: 'png',
      widths: [240, 768, imageSrc.width],
    });
    const avif = await getImage({
      src: imageSrc,
      format: 'avif',
      widths: [240, 768, imageSrc.width],
    });
    images[imageName] = {
      png: {
        image: png,
        cssUrl: `url(${png.src})`,
        cssImageSet: `url(${png.src}) 1x, url(${png.src}) 2x`,
      },
      avif: {
        image: avif,
        cssUrl: `url(${avif.src})`,
        cssImageSet: `url(${avif.src}) 1x, url(${avif.src}) 2x`,
      },
    };
  }
  return images;
};
