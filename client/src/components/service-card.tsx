import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string | undefined;
  link: string;
}

export default function ServiceCard({
  title,
  description,
  image,
  link,
}: ServiceCardProps) {
  return (
    <Card className="service-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        <Link
          href={link}
          data-testid={`card-service-${title.toLowerCase().replace(" ", "-")}`}
        >
          <div className="cursor-pointer">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-8">
              <h3 className="font-serif text-2xl font-semibold text-charcoal-800 mb-4">
                {title}
              </h3>
              <p className="text-charcoal-600 mb-6">{description}</p>
              <span className="text-gold-500 font-semibold hover:text-gold-600 transition-colors">
                View Projects →
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
