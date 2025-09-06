import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactSubmissionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const contactFormSchema = insertContactSubmissionSchema.extend({
  phone: z.string().optional(),
  projectType: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      message: "",
    },
  });

  const submitContactForm = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description:
          "Thank you for your message! We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactForm.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
              Let's <span className="text-gold-500">Talk</span>
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Ready to transform your space? Get in touch to discuss your
              project and discover how we can bring your vision to life
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-charcoal-800 mb-8">
                  Get in Touch
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <div
                    className="flex items-start space-x-4"
                    data-testid="contact-phone"
                  >
                    <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-800 mb-2">
                        Phone
                      </h3>
                      <p className="text-gold-500">LANDO W. TITUS</p>
                      <p className="text-charcoal-600">+254 719 118 500</p>
                      <p className="text-gold-500">TUMU MWAMINDI</p>
                      <p className="text-charcoal-600">+254 727 166 425</p>
                      <p className="text-charcoal-600 text-sm">
                        Mon - Fri, 8:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div
                    className="flex items-start space-x-4"
                    data-testid="contact-email"
                  >
                    <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-800 mb-2">
                        Email
                      </h3>
                      <p className="text-charcoal-600">
                        info.craftarchitectures@gmail.com
                      </p>
                      <p className="text-charcoal-600 text-sm">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div
                    className="flex items-start space-x-4"
                    data-testid="contact-address"
                  >
                    <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-800 mb-2">
                        Office
                      </h3>
                      <p className="text-charcoal-600">
                        <b>Nairobi Office: </b>Ruiru Bypass, Nairobi
                        <br />
                        <b>Mombasa Office: </b>Ukunda / Diani, Kwale
                      </p>
                      <p className="text-charcoal-600 text-sm">
                        By appointment only
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-charcoal-800 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4" data-testid="social-links">
                  <a
                    href="#"
                    className="w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors"
                    data-testid="link-facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/artfulstructures_.ltd?igsh=a3NxNDJ5NTR6NmJ0"
                    className="w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors"
                    data-testid="link-instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/ARTFULSTRUCTURE"
                    className="w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors"
                    data-testid="link-twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="www.tiktok.com/@artfulstructuresltd"
                    className="w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors"
                    data-testid="link-tiktok"
                  >
                    <SiTiktok className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-cream-50 rounded-3xl p-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal-800 mb-6">
                Send us a Message
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  data-testid="contact-form"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
                            {...field}
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+254 700 123 456"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Project Type */}
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-project-type">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="home-interior">
                              Home Interior Design
                            </SelectItem>
                            <SelectItem value="commercial-interior">
                              Commercial Interior Design
                            </SelectItem>
                            <SelectItem value="gypsum-ceilings">
                              Gypsum Ceilings
                            </SelectItem>
                            <SelectItem value="flooring-services">
                              Flooring Services
                            </SelectItem>
                            <SelectItem value="painting-services">
                              Painting Services
                            </SelectItem>
                            <SelectItem value="office-partitioning">
                              Office Partitioning
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project, timeline, and any specific requirements..."
                            className="resize-none"
                            rows={5}
                            {...field}
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gold-500 text-white hover:bg-gold-600"
                    disabled={submitContactForm.isPending}
                    data-testid="button-submit"
                  >
                    {submitContactForm.isPending
                      ? "Sending..."
                      : "Send Message"}
                  </Button>

                  <p className="text-sm text-charcoal-600 text-center">
                    We'll get back to you within 24 hours to discuss your
                    project
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
