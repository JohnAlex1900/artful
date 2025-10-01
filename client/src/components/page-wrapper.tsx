import { ReactNode } from "react";
import Reveal from "@/components/reveal";

type PageWrapperProps = {
  children: ReactNode;
};

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen">
      <Reveal>{children}</Reveal>
    </div>
  );
}
