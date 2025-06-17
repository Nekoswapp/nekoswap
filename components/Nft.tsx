import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import Image from "next/image";
export default function Nft() {
  const list = [
    {
      title: "Orange",
      img: "/images/quis.png",
      price: "$2.50",
    },
    {
      title: "Orange",
      img: "/images/cat2.png",
      price: "$0.50",
    },
    {
      title: "Orange",
      img: "/images/helmCat.png",
      price: "$1.50",
    },
    
  ];

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
        /* eslint-disable no-console */
        <Card key={index} isPressable shadow="sm" onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
            <Image
              alt={item.title}
              className="w-full object-cover h-[220px]"
              src={item.img}
              width={500}     // ganti sesuai ukuran yang kamu inginkan
              height={500} 
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
