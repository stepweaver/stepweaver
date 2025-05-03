'use client';

import { usePathname } from 'next/navigation';
import MainNav from '@/components/navigation/MainNav';
import MobileNav from '@/components/navigation/MobileNav';

export default function NavWrap() {
  const pathname = usePathname();
  const isResistPage =
    pathname === '/resist' || pathname?.startsWith('/resist/');

  if (isResistPage) {
    return null;
  }

  return (
    <>
      <MainNav />
      <MobileNav />
    </>
  );
}
