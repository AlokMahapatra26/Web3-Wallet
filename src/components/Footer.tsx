import Link from "next/link";
import React from "react";

// fonts


const Footer = () => {
  return (
    <section className="max-w-7xl mx-auto border-t px-4">
      <div className="flex justify-between py-8">
        <p className="text-primary tracking-tight">
          Designed and Developed by {" "}
          <Link href="https://x.com/aloktwts" className="font-bold">
            Alok
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Footer;