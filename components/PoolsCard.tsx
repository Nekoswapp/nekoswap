"use client";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import React from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
export default function PoolsCard() {
  return (
    <div className="flex items-center justify-center mt-20">
      <Image alt="HeroUI hero Image" src="/images/meow-left.png" width={200} />
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-2">
          <Avatar
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          <div className="flex flex-col">
            <p className="text-md">HeroUI</p>
            <p className="text-small text-default-500">heroui.com</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
        <Divider />
        <CardFooter>
          <h1>jaja</h1>
        </CardFooter>
      </Card>
      <Image alt="HeroUI hero Image" src="/images/meow.png" width={200} />
    </div>
  );
}
