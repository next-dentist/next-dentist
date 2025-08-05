'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    ArrowRight,
    Github,
    Heart,
    Lightbulb,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Shield,
    Star,
    Target,
    Twitter,
    User,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';

export default function TeamPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  const leadershipTeam = [
    {
      name: "Dr. Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "/images/team/sarah-johnson.webp",
      bio: "Leading NextDentist's mission to revolutionize dental care accessibility. 15+ years in healthcare technology.",
      expertise: ["Healthcare Innovation", "Strategic Leadership", "Patient Care"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@nextdentist.com"
      }
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      image: "/images/team/michael-chen.webp",
      bio: "Architecting the future of dental technology. Expert in scalable healthcare platforms and AI integration.",
      expertise: ["Technology Architecture", "AI/ML", "Product Development"],
      social: {
        linkedin: "#",
        github: "#",
        email: "michael@nextdentist.com"
      }
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Chief Medical Officer",
      image: "/images/team/emily-rodriguez.webp",
      bio: "Ensuring clinical excellence and patient safety. Board-certified dentist with expertise in digital dentistry.",
      expertise: ["Clinical Excellence", "Digital Dentistry", "Patient Safety"],
      social: {
        linkedin: "#",
        email: "emily@nextdentist.com"
      }
    }
  ];

  const coreTeam = [
    {
      name: "Alex Thompson",
      role: "Head of Product",
      image: "/images/team/alex-thompson.webp",
      bio: "Crafting exceptional user experiences for patients and dental professionals.",
      department: "Product"
    },
    {
      name: "Lisa Wang",
      role: "Head of Engineering",
      image: "/images/team/lisa-wang.webp",
      bio: "Building robust, scalable systems that power millions of dental appointments.",
      department: "Engineering"
    },
    {
      name: "David Martinez",
      role: "Head of Marketing",
      image: "/images/team/david-martinez.webp",
      bio: "Connecting patients with the right dental care through strategic marketing initiatives.",
      department: "Marketing"
    },
    {
      name: "Rachel Green",
      role: "Head of Customer Success",
      image: "/images/team/rachel-green.webp",
      bio: "Ensuring every patient and dentist has an exceptional experience with our platform.",
      department: "Customer Success"
    },
    {
      name: "James Wilson",
      role: "Head of Operations",
      image: "/images/team/james-wilson.webp",
      bio: "Optimizing processes to deliver seamless dental care coordination across the country.",
      department: "Operations"
    },
    {
      name: "Sophie Kim",
      role: "Head of Design",
      image: "/images/team/sophie-kim.webp",
      bio: "Creating beautiful, intuitive interfaces that make dental care accessible to everyone.",
      department: "Design"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-First",
      description: "Every decision we make prioritizes patient care and accessibility."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in technology, service, and clinical outcomes."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Success comes from working together with dentists, patients, and our team."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously innovating to solve complex healthcare challenges."
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building trust through transparency, security, and reliable service."
    },
    {
      icon: Zap,
      title: "Impact",
      description: "Making a meaningful difference in dental care accessibility."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/10 to-secondary/10 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center space-y-6 md:space-y-8 animate-fade-in-up">
            <div className="inline-block rounded-full bg-primary/10 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-primary shadow-sm">
              Meet Our Team
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-bold text-foreground">
              The <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dedicated Team
              </span> Behind NextDentist
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
              We're a passionate team of healthcare professionals, technologists, and innovators working together to revolutionize dental care accessibility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <Users className="h-4 w-4 md:h-5 md:w-5" />
                <span>50+ Team Members</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                <span>Vadodara, Gujarat</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <Star className="h-4 w-4 md:h-5 md:w-5" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Leadership Team
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the visionary leaders driving NextDentist's mission to transform dental care accessibility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {leadershipTeam.map((member, index) => (
              <div 
                key={member.name}
                className="group relative bg-background rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg md:shadow-xl border border-border/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-center space-y-4 md:space-y-6">
                  {/* Profile Image Placeholder */}
                  <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <User className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-primary" />
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-primary font-semibold text-sm md:text-base">{member.role}</p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill) => (
                      <span 
                        key={skill}
                        className="inline-block px-3 py-1 text-xs md:text-sm bg-primary/10 text-primary rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-3 md:gap-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                        <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                        <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                        <Github className="h-4 w-4 md:h-5 md:w-5" />
                      </a>
                    )}
                    <a href={`mailto:${member.social.email}`} className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-300">
                      <Mail className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Core Team
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our talented team of professionals working across departments to deliver exceptional dental care experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {coreTeam.map((member, index) => (
              <div 
                key={member.name}
                className="group bg-card rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="space-y-4 md:space-y-6">
                  {/* Profile Image Placeholder */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-primary font-semibold text-sm md:text-base">{member.role}</p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                  
                  <div className="inline-block px-3 py-1 text-xs md:text-sm bg-secondary/10 text-secondary rounded-full font-medium">
                    {member.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Culture Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Our Values & Culture
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide our team and shape our company culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="group bg-background rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="space-y-4 md:space-y-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <value.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">{value.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center space-y-2 md:space-y-4 animate-fade-in-up">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                50+
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Team Members</p>
            </div>
            
            <div className="text-center space-y-2 md:space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                1000+
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Dental Partners</p>
            </div>
            
            <div className="text-center space-y-2 md:space-y-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                50K+
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Patients Served</p>
            </div>
            
            <div className="text-center space-y-2 md:space-y-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                4.9/5
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Team Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Have questions about our team or want to join us? We'd love to hear from you.
              </p>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">team@nextdentist.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">+91 9328036817</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Office</p>
                    <p className="text-muted-foreground">203, Bricklane 1964, Mangal Pandey Rd, near L&T Circle, Karelibagh, Vadodara, Gujarat 390018</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="group h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl w-full">
                    Contact Our Team
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader className="text-center">
                    <DialogTitle className="text-xl md:text-2xl font-bold">Contact Our Team</DialogTitle>
                    <DialogDescription className="text-base md:text-lg">
                      Send us a message and we'll get back to you as soon as possible.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="h-10 md:h-12 text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="h-10 md:h-12 text-sm md:text-base"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm md:text-base"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold">
                      Send Message
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 