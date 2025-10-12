import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { usePrinters } from '@/hooks/usePrinters';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search } from 'lucide-react';

const Products = () => {
  const { printers } = usePrinters();
  const [searchTerm, setSearchTerm] = useState('');

  const availablePrinters = printers.filter(p => p.isAvailable);
  const filteredPrinters = availablePrinters.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Browse our collection of quality printers
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search printers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredPrinters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? 'No printers found matching your search.' : 'No printers available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrinters.map((printer) => (
              <ProductCard key={printer.id} printer={printer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
