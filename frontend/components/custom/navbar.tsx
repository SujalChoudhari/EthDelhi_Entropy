import Image from "next/image";
import Link from "next/link";




import { SlashIcon } from "./icons";
import { Button } from "../ui/button";


export const Navbar = async () => {


  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center">
        
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/images/gemini-logo.png"
              height={20}
              width={20}
              alt="gemini logo"
            />
            <div className="text-zinc-500">
              <SlashIcon size={16} />
            </div>
            <div className="text-sm dark:text-zinc-300 truncate w-28 md:w-fit">
              Vyom
            </div>
          </div>
        </div>


          <Button className="py-1.5 px-2 h-fit font-normal text-white" asChild>
            <Link href="/login">Login</Link>
          </Button>
        
      </div>
    </>
  );
};
