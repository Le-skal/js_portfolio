import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitch,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContactSection = ({ isPopup }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Use localhost for local dev, relative path for Vercel
    const apiUrl = import.meta.env.DEV
      ? 'http://localhost:3001/api/send-email'
      : '/api/send-email';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t("contact.messageSent"),
          description: t("contact.messageSentDesc"),
        });
        e.target.reset(); // Clear form
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={isPopup ? "w-full terminal-contact" : "py-24 px-4 relative"}>
      <div className={isPopup ? "w-full" : "container mx-auto max-w-5xl"}>
        {/* Header */}
        {!isPopup && (
          <div className="space-y-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-tight">
              {t("contact.title")}
            </h2>
            <p className="text-sm text-foreground/60 uppercase tracking-widest">
              {t("contact.subtitle")}
            </p>
          </div>
        )}

        {!isPopup && (
          <p className="text-sm text-foreground/70 mb-8 max-w-2xl leading-relaxed">
            {t("contact.description")}
          </p>
        )}

        <div className={isPopup ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
          {/* Contact Info */}
          <div className={isPopup ? "space-y-2" : "space-y-6"}>
            {!isPopup && (
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4">
                {t("contact.contactInfo")}
              </h3>
            )}

            <div className={isPopup ? "space-y-2" : "space-y-4"}>
              <div className="flex items-start gap-2">
                <div className={isPopup ? "p-1.5 bg-violet-500/20 rounded flex-shrink-0 border border-violet-400/30" : "p-2 bg-primary/10 rounded-sm flex-shrink-0"}>
                  <Mail className={isPopup ? "h-4 w-4 text-violet-300" : "h-5 w-5 text-primary"} />
                </div>
                <div className="text-left">
                  <h4 className={isPopup ? "font-semibold text-xs text-violet-300 uppercase tracking-wider mb-1 font-mono" : "font-semibold text-xs uppercase tracking-wide mb-1"}>
                    {t("contact.email")}
                  </h4>
                  <button
                    onClick={() => copyToClipboard("raphael.martin.2004@gmail.com", "Email")}
                    className={isPopup ? "text-xs text-violet-200/90 hover:text-violet-100 transition-colors font-mono cursor-pointer" : "text-sm text-foreground/70 hover:text-primary transition-colors cursor-pointer"}
                  >
                    raphael.martin.2004@gmail.com
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className={isPopup ? "p-1.5 bg-violet-500/20 rounded flex-shrink-0 border border-violet-400/30" : "p-2 bg-primary/10 rounded-sm flex-shrink-0"}>
                  <Phone className={isPopup ? "h-4 w-4 text-violet-300" : "h-5 w-5 text-primary"} />
                </div>
                <div className="text-left">
                  <h4 className={isPopup ? "font-semibold text-xs text-violet-300 uppercase tracking-wider mb-1 font-mono" : "font-semibold text-xs uppercase tracking-wide mb-1"}>
                    {t("contact.phone")}
                  </h4>
                  <button
                    onClick={() => copyToClipboard("+33677151276", "Phone")}
                    className={isPopup ? "text-xs text-violet-200/90 hover:text-violet-100 transition-colors font-mono cursor-pointer" : "text-sm text-foreground/70 hover:text-primary transition-colors cursor-pointer"}
                  >
                    +33 (0)6 77 15 12 76
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className={isPopup ? "p-1.5 bg-violet-500/20 rounded flex-shrink-0 border border-violet-400/30" : "p-2 bg-primary/10 rounded-sm flex-shrink-0"}>
                  <MapPin className={isPopup ? "h-4 w-4 text-violet-300" : "h-5 w-5 text-primary"} />
                </div>
                <div className="text-left">
                  <h4 className={isPopup ? "font-semibold text-xs text-violet-300 uppercase tracking-wider mb-1 font-mono" : "font-semibold text-xs uppercase tracking-wide mb-1"}>
                    {t("contact.location")}
                  </h4>
                  <button
                    onClick={() => copyToClipboard("Paris, 75015, France", "Location")}
                    className={isPopup ? "text-xs text-violet-200/90 hover:text-violet-100 transition-colors font-mono cursor-pointer" : "text-sm text-foreground/70 hover:text-primary transition-colors cursor-pointer"}
                  >
                    Paris, 75015, France
                  </button>
                </div>
              </div>
            </div>

            {!isPopup && (
              <div className="pt-4 border-t border-foreground/10">
                <h4 className="font-semibold text-xs uppercase tracking-widest mb-4">
                  {t("contact.connectWithMe")}
                </h4>
                <a
                  href="https://www.linkedin.com/in/raphael-martin-10a17128a/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  <Linkedin size={18} />
                  <span className="uppercase tracking-wide">LinkedIn</span>
                </a>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className={isPopup ? "border-t border-violet-400/30 pt-4 mt-4" : "border border-foreground/10 p-6 bg-card/50"}>
            <h3 className={isPopup ? "text-sm font-semibold uppercase tracking-widest mb-4 text-violet-300 font-mono" : "text-sm font-semibold uppercase tracking-widest mb-6"}>
              <span className="text-violet-400">&gt;</span> {t("contact.sendAMessage")}
            </h3>

            <form className={isPopup ? "space-y-3" : "space-y-4"} onSubmit={handleSubmit}>
              <div className="text-left">
                <label
                  htmlFor="name"
                  className={isPopup ? "block text-xs font-semibold text-violet-300 mb-2 text-left font-mono uppercase tracking-wider" : "block text-xs font-semibold uppercase tracking-wider mb-2"}
                >
                  <span className="text-violet-400">&gt;</span> {t("contact.yourName")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={isPopup ? "w-full px-3 py-2 text-sm bg-violet-950/30 border border-violet-400/30 focus:border-violet-400 focus:outline-none text-left text-violet-100 font-mono placeholder-violet-400/40 focus:ring-2 focus:ring-violet-400/20 transition-all" : "w-full px-3 py-2 text-sm bg-background border border-foreground/10 focus:border-primary focus:outline-none transition-colors"}
                  placeholder={t("contact.namePlaceholder")}
                />
              </div>

              <div className="text-left">
                <label
                  htmlFor="email"
                  className={isPopup ? "block text-xs font-semibold text-violet-300 mb-2 text-left font-mono uppercase tracking-wider" : "block text-xs font-semibold uppercase tracking-wider mb-2"}
                >
                  <span className="text-violet-400">&gt;</span> {t("contact.yourEmail")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={isPopup ? "w-full px-3 py-2 text-sm bg-violet-950/30 border border-violet-400/30 focus:border-violet-400 focus:outline-none text-left text-violet-100 font-mono placeholder-violet-400/40 focus:ring-2 focus:ring-violet-400/20 transition-all" : "w-full px-3 py-2 text-sm bg-background border border-foreground/10 focus:border-primary focus:outline-none transition-colors"}
                  placeholder={t("contact.emailPlaceholder")}
                />
              </div>

              <div className="text-left">
                <label
                  htmlFor="message"
                  className={isPopup ? "block text-xs font-semibold text-violet-300 mb-2 text-left font-mono uppercase tracking-wider" : "block text-xs font-semibold uppercase tracking-wider mb-2"}
                >
                  <span className="text-violet-400">&gt;</span> {t("contact.yourMessage")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className={isPopup ? "w-full px-3 py-2 text-sm bg-violet-950/30 border border-violet-400/30 focus:border-violet-400 focus:outline-none resize-none h-24 text-left text-violet-100 font-mono placeholder-violet-400/40 focus:ring-2 focus:ring-violet-400/20 transition-all" : "w-full px-3 py-2 text-sm bg-background border border-foreground/10 focus:border-primary focus:outline-none transition-colors resize-none h-24"}
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={isPopup ? "w-full px-4 py-3 text-sm bg-transparent hover:bg-violet-500/20 text-violet-300 font-semibold border-2 border-violet-400/50 hover:border-violet-400 transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] disabled:opacity-50 disabled:cursor-not-allowed" : "cosmic-button w-full flex items-center justify-center gap-2 text-xs"}
              >
                {isSubmitting ? t("contact.sending") : t("contact.sendMessage")}
                <Send size={isPopup ? 14 : 14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
