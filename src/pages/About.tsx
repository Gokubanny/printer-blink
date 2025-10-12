import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">About PrintHub</h1>
          
          <Card className="mb-6 animate-fade-in hover-scale" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p className="text-muted-foreground mb-4">
                PrintHub is your trusted source for quality printers and printing solutions. 
                We specialize in providing a wide range of printers suitable for home offices, 
                small businesses, and professional environments.
              </p>
              <p className="text-muted-foreground mb-4">
                With years of experience in the printing industry, we understand the importance 
                of reliable, high-quality printing equipment. Our mission is to help you find 
                the perfect printer that meets your specific needs and budget.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Quality products from trusted brands</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Competitive pricing and great value</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Fast and responsive customer service via WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Expert advice to help you choose the right printer</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover-scale" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground">
                Have questions? We're here to help! Contact us via WhatsApp for instant 
                support and personalized recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
