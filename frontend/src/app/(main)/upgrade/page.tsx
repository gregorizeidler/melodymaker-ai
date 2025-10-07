import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Check, Zap } from "lucide-react";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default async function UpgradePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  const packages = [
    {
      name: "Small",
      credits: 10,
      price: "$4.99",
      pricePerCredit: "$0.50",
      slug: "small",
      popular: false,
      features: [
        "10 Music Generations",
        "Full Quality WAV Downloads",
        "Album Cover Art",
        "Share & Publish",
      ],
    },
    {
      name: "Medium",
      credits: 25,
      price: "$9.99",
      pricePerCredit: "$0.40",
      slug: "medium",
      popular: true,
      features: [
        "25 Music Generations",
        "Full Quality WAV Downloads",
        "Album Cover Art",
        "Share & Publish",
        "Priority Processing",
      ],
    },
    {
      name: "Large",
      credits: 50,
      price: "$14.99",
      pricePerCredit: "$0.30",
      slug: "large",
      popular: false,
      features: [
        "50 Music Generations",
        "Full Quality WAV Downloads",
        "Album Cover Art",
        "Share & Publish",
        "Priority Processing",
        "Early Access to New Features",
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Upgrade Your Plan</h1>
        <p className="text-muted-foreground text-lg">
          Choose the perfect package for your music creation needs
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className="text-sm">
            Current Credits: {user?.credits || 0}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
        {packages.map((pkg) => (
          <Card key={pkg.slug} className={pkg.popular ? "border-primary shadow-lg" : ""}>
            {pkg.popular && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pkg.name}
                {pkg.popular && <Zap className="h-5 w-5 text-primary" />}
              </CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                  <span className="text-muted-foreground ml-2">
                    ({pkg.pricePerCredit}/credit)
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-2">
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {pkg.credits} Credits
                </Badge>
              </div>
              <ul className="space-y-2">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <form action={`/api/auth/checkout/${pkg.slug}`} method="POST" className="w-full">
                <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                  Purchase {pkg.name}
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-center">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Choose Package</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select the credit package that fits your needs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Secure checkout powered by Polar
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Start Creating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Credits added instantly - start making music!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
