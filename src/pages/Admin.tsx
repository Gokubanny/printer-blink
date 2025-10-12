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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      toast({ title: 'Welcome Admin!' });
    } else {
      toast({ title: 'Invalid email', variant: 'destructive' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePrinter(editingId, {
        ...formData,
        price: parseFloat(formData.price),
      });
      toast({ title: 'Printer updated successfully!' });
    } else {
      addPrinter({
        ...formData,
        price: parseFloat(formData.price),
        isAvailable: true,
      });
      toast({ title: 'Printer added successfully!' });
    }
    setFormData({ name: '', price: '', image: '', description: '' });
    setShowAddDialog(false);
    setEditingId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Image too large', description: 'Please select an image under 5MB', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this printer?')) {
      deletePrinter(id);
      toast({ title: 'Printer deleted successfully!' });
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
                    placeholder="Enter admin email"
                    className="mt-1"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base">Login</Button>
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
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormData({ name: '', price: '', image: '', description: '' });
                setImagePreview('');
                setEditingId(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Printer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{editingId ? 'Edit Printer' : 'Add New Printer'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-base">Printer Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., HP DeskJet 2720"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-base">Price (₦)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="100"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g., 45000"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-base">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the printer..."
                        className="mt-1 min-h-[100px]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="image" className="text-base">Printer Image</Label>
                    <div className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData({ ...formData, image: '' });
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
                            required={!editingId}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-base">
                  {editingId ? 'Update Printer' : 'Add Printer'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

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
