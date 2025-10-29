import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { Printer } from '@/types/printer';

interface ProductCardProps {
  printer: Printer;
}

export const ProductCard = ({ printer }: ProductCardProps) => {
  const whatsappMessage = `Hello, I'm interested in the ${printer.name} I saw on your website.`;
  const whatsappLink = `https://wa.link/iy0oov?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover-scale">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden relative group">
          <img
            src={printer.image}
            alt={printer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!printer.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">Sold Out</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-xl mb-2 line-clamp-1">{printer.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">{printer.description}</p>
        <p className="text-3xl font-bold text-primary mb-4">₦{printer.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full h-12 text-base" 
          onClick={() => window.open(whatsappLink, '_blank')}
          disabled={!printer.isAvailable}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};
