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
  const whatsappLink = `https://wa.me/2349135114075?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={printer.image}
            alt={printer.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{printer.name}</h3>
          {!printer.isAvailable && (
            <Badge variant="destructive">Sold Out</Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm mb-3">{printer.description}</p>
        <p className="text-2xl font-bold text-primary">₦{printer.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => window.open(whatsappLink, '_blank')}
          disabled={!printer.isAvailable}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};
