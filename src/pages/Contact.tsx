import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone } from 'lucide-react';

const Contact = () => {
  const whatsappLink = 'https://wa.me/2349135114075?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20printers';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Get in touch with us for any inquiries about our printers
          </p>
          
          <Card className="mb-6 animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground mb-3">
                      Chat with us directly for instant responses
                    </p>
                    <Button onClick={() => window.open(whatsappLink, '_blank')}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat Now
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-muted-foreground">
                      +234 913 511 4075
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      omatulemarvellous721@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Business Hours</h2>
              <p className="text-lg opacity-90">Monday - Saturday: 9:00 AM - 6:00 PM</p>
              <p className="text-lg opacity-90">Sunday: Closed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
