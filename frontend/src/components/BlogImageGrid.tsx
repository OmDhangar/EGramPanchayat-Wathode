import { BlogImage } from "../pages/Blogs";

interface BlogImageGridProps {
  images: BlogImage[];
}

export default function BlogImageGrid({ images }: BlogImageGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((img, i) => (
        <img
          key={i}
          src={img.url}
          alt={`blog-${i}`}
          className="rounded-lg object-cover w-full h-40"
        />
      ))}
    </div>
  );
}
