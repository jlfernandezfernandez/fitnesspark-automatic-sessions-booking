import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogContent, Dialog } from "@/components/ui/dialog";
import {
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  Carousel,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function CarouselModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // handle form submission logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Image
                  alt="Presentation Image"
                  className="rounded-lg object-cover"
                  height={400}
                  src="/placeholder.svg"
                  style={{ aspectRatio: "400/400", objectFit: "cover" }}
                  width={400}
                />
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Welcome to our App</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Discover the power of our innovative platform.
                    </p>
                  </div>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">
                      Unlock Your Potential
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Our app empowers you to achieve more than ever before.
                    </p>
                  </div>
                  <Button variant="outline">Explore Features</Button>
                </div>
                <Image
                  alt="Presentation Image"
                  className="rounded-lg object-cover"
                  height={400}
                  src="/placeholder.svg"
                  style={{ aspectRatio: "400/400", objectFit: "cover" }}
                  width={400}
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Sign In</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter your email and password to access your account.
                    </p>
                  </div>
                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="m@example.com"
                        type="email"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <Button className="w-full" type="submit">
                      Sign In
                    </Button>
                  </form>
                </div>
                <Image
                  alt="Presentation Image"
                  className="rounded-lg object-cover"
                  height={400}
                  src="/placeholder.svg"
                  style={{ aspectRatio: "400/400", objectFit: "cover" }}
                  width={400}
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
