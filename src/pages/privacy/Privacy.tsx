import { useState, useEffect } from "react";
import AnimatedContent from "@/components/animation/animated-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLegalContent } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function Privacy() {
  const [title, setTitle] = useState("Privacy Policy");
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrivacyContent() {
      try {
        const res = await fetchLegalContent("privacy");
        if (res) {
          if (res.title) setTitle(res.title);
          if (res.content) setContent(res.content);
        }
      } catch (err) {
        console.error("Failed to load privacy content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPrivacyContent();
  }, []);

  return (
    <section className="section-container py-8 sm:py-14 max-w-4xl mx-auto px-4">
      <AnimatedContent direction="up" delay={0.1}>
        <Card className="bg-card/90 border-border/80 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-border/60 p-6 sm:p-8">
            <CardTitle>
              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {title}
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading Privacy Policy...</span>
              </div>
            ) : content ? (
              <div
                className="prose prose-invert max-w-none 
                  prose-h1:text-2xl prose-h1:font-bold prose-h1:text-foreground prose-h1:mb-4
                  prose-h2:text-xl prose-h2:font-semibold prose-h2:text-primary prose-h2:mt-6 prose-h2:mb-3
                  prose-h3:text-lg prose-h3:font-medium prose-h3:text-foreground prose-h3:mt-4 prose-h3:mb-2
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-4 prose-ul:text-muted-foreground
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:mb-4 prose-ol:text-muted-foreground
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-foreground
                  prose-a:text-primary prose-a:underline hover:prose-a:opacity-80
                  prose-hr:border-border/60 prose-hr:my-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="flex flex-col gap-6 text-muted-foreground text-sm leading-relaxed">
                <p>
                  At GocalAI, we respect your privacy and are committed to protecting your personal data.
                  This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </section>
  );
}