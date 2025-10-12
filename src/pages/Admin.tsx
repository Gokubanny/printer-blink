import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, usePrinters } from '@/hooks/usePrinters';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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

  const handleEdit = (id: string) => {
    const printer = printers.find(p => p.id === id);
    if (printer) {
      setFormData({
        name: printer.name,
        price: printer.price.toString(),
        image: printer.image,
        description: printer.description,
      });
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
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Login</Button>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormData({ name: '', price: '', image: '', description: '' });
                setEditingId(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Printer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Printer' : 'Add New Printer'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Add'} Printer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {printers.map((printer) => (
            <Card key={printer.id}>
              <CardHeader>
                <img
                  src={printer.image}
                  alt={printer.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <CardTitle className="flex items-center justify-between">
                  {printer.name}
                  <span className={`text-sm ${printer.isAvailable ? 'text-green-600' : 'text-destructive'}`}>
                    {printer.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{printer.description}</p>
                <p className="text-xl font-bold text-primary mb-4">₦{printer.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(printer.id)}
                  >
                    {printer.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(printer.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(printer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
