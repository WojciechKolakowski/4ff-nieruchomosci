"use client";

import { useLoginModal } from "./LoginModalProvider";

export function OpenLoginModalButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useLoginModal();
  return (
    <button className={className} onClick={open}>
      {children}
    </button>
  );
}
