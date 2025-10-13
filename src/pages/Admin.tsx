import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, usePrinters } from '@/hooks/usePrinters';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

const Admin = () => {
  const { isAdmin, login } = useAuth();
  const { printers, addPrinter, updatePrinter, deletePrinter, toggleAvailability } = usePrinters();
  const [email, setEmail] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email);
    if (success) {
      toast({ title: 'Welcome Admin!' });
    } else {
      toast({ title: 'Invalid email', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form Data State:', formData);
    console.log('Image Preview exists:', !!imagePreview);
    console.log('All fields filled:', {
      name: !!formData.name,
      price: !!formData.price,
      description: !!formData.description,
      image: !!formData.image
    });

    // Validate form with detailed messages
    if (!formData.name || !formData.price || !formData.description) {
      const missingFields = [];
      if (!formData.name) missingFields.push('name');
      if (!formData.price) missingFields.push('price');
      if (!formData.description) missingFields.push('description');
      
      toast({
        title: 'Missing required fields',
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.image && !editingId) {
      toast({
        title: 'Image required',
        description: 'Please select an image for the printer',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const printerData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description.trim(),
        isAvailable: true,
        category: 'other',
        brand: ''
      };

      console.log('Submitting printer data to API:', printerData);

      if (editingId) {
        await updatePrinter(editingId, printerData);
        toast({ title: 'Printer updated successfully!' });
      } else {
        await addPrinter(printerData);
        toast({ title: 'Printer added successfully!' });
      }

      // Reset form
      setFormData({ name: '', price: '', image: '', description: '' });
      setImagePreview('');
      setShowAddDialog(false);
      setEditingId(null);
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is handled in the usePrinters hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);

      if (file.size > 5 * 1024 * 1024) {
        toast({ 
          title: 'Image too large', 
          description: 'Please select an image under 5MB', 
          variant: 'destructive' 
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        console.log('Starting to read file...');
      };
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Image converted to base64, length:', base64String.length);
        console.log('First 100 chars:', base64String.substring(0, 100));
        
        setFormData(prev => ({ 
          ...prev, 
          image: base64String 
        }));
        setImagePreview(base64String);
        
        console.log('Image saved to formData:', !!base64String);
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        toast({
          title: 'Error reading image',
          description: 'Failed to read the image file',
          variant: 'destructive',
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (id: string) => {
    const printer = printers.find(p => p.id === id);
    if (printer) {
      setFormData({
        name: printer.name,
        price: printer.price.toString(),
        image: printer.image,
        description: printer.description,
      });
      setImagePreview(printer.image);
      setEditingId(id);
      setShowAddDialog(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this printer?')) {
      try {
        await deletePrinter(id);
        toast({ title: 'Printer deleted successfully!' });
      } catch (error) {
        // Error is handled in the usePrinters hook
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto animate-fade-in hover-scale">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-base">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="omatulemarvellous721@gmail.com"
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your printer inventory</p>
          </div>
          <Button 
            onClick={() => {
              console.log('Opening add printer dialog');
              setFormData({ name: '', price: '', image: '', description: '' });
              setImagePreview('');
              setEditingId(null);
              setShowAddDialog(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Printer
          </Button>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingId ? 'Edit Printer' : 'Add New Printer'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Update the printer details below.' : 'Fill in all fields to add a new printer.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base">Printer Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        console.log('Name changed:', e.target.value);
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                      }}
                      placeholder="e.g., HP DeskJet 2720"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-base">Price (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.price}
                      onChange={(e) => {
                        console.log('Price changed:', e.target.value);
                        setFormData(prev => ({ ...prev, price: e.target.value }));
                      }}
                      placeholder="e.g., 45000"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-base">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        console.log('Description changed:', e.target.value);
                        setFormData(prev => ({ ...prev, description: e.target.value }));
                      }}
                      placeholder="Brief description of the printer..."
                      className="mt-1 min-h-[100px]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image" className="text-base">
                    Printer Image {!editingId && '*'}
                  </Label>
                  <div className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="text-xs text-muted-foreground">
                          Image ready: {formData.image ? 'YES' : 'NO'}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Removing image');
                            setFormData(prev => ({ ...prev, image: '' }));
                            setImagePreview('');
                          }}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="image" className="cursor-pointer block">
                        <div className="space-y-2 py-6">
                          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Plus className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click to upload image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                        <Input
                          id="image"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                * Required fields
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Printer' : 'Add Printer')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {printers.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Printer className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No printers yet</h3>
            <p className="text-muted-foreground mb-6">Add your first printer to get started</p>
            <Button onClick={() => {
              setFormData({ name: '', price: '', image: '', description: '' });
              setImagePreview('');
              setEditingId(null);
              setShowAddDialog(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Printer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {printers.map((printer, index) => (
              <Card 
                key={printer.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden group">
                    <img
                      src={printer.image}
                      alt={printer.name}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        printer.isAvailable 
                          ? 'bg-green-500 text-white' 
                          : 'bg-destructive text-destructive-foreground'
                      }`}>
                        {printer.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-3 line-clamp-1">
                    {printer.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {printer.description}
                  </p>
                  <p className="text-2xl font-bold text-primary mb-6">
                    ₦{printer.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAvailability(printer.id)}
                      className="flex-1"
                      title={printer.isAvailable ? 'Mark as Sold Out' : 'Mark as Available'}
                    >
                      {printer.isAvailable ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(printer.id)}
                      title="Edit Printer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(printer.id)}
                      title="Delete Printer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;