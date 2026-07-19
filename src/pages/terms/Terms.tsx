import AnimatedContent from "@/components/animation/animated-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <section className="section-container py-18 sm:py-14">
      <AnimatedContent direction="up" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Terms & Condition
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 text-muted-foreground text-sm leading-relaxed mt-2">
              <p>
                There are many variations of passages of Lorem Ipsum available, but the majority
                have suffered alteration in some form, by injected humour, or randomised words
                which don't look even slightly believable. If you are going to use a passage of
                Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the
                middle of text. All the Lorem Ipsum generators on the Internet tend to repeat
                predefined chunks as necessary, making this the first true generator on the Internet.
                It uses a dictionary of over 200 Latin words, combined with a handful of model
                sentence structures, to generate Lorem Ipsum which looks reasonable. The generated
                Lorem Ipsum is therefore always free from repetition, injected humour, or
                non-characteristic words etc.
              </p>
              <p>
                There are many variations of passages of Lorem Ipsum available, but the majority
                have suffered alteration in some form, by injected humour, or randomised words
                which don't look even slightly believable. If you are going to use a passage of
                Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the
                middle of text. All the Lorem Ipsum generators on the Internet tend to repeat
                predefined chunks as necessary, making this the first true generator on the Internet.
                It uses a dictionary of over 200 Latin words, combined with a handful of model
                sentence structures, to generate Lorem Ipsum which looks reasonable. The generated
                Lorem Ipsum is therefore always free from repetition, injected humour, or
                non-characteristic words etc. There are many variations of passages of Lorem Ipsum
                available, but the majority have suffered alteration in some form, by injected
                humour, or randomised words which don't look even slightly believable. If you are
                going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
                embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the
                Internet tend to repeat predefined chunks as necessary, making this the first
                true generator on the Internet. It uses a dictionary of over 200 Latin words,
                combined with a handful of model sentence structures, to generate Lorem Ipsum
                which looks reasonable. The generated Lorem Ipsum.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedContent>
    </section>
  );
}