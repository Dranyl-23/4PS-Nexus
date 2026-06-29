import BeneficiaryShell from '@/components/BeneficiaryShell';

export default function BeneficiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BeneficiaryShell>{children}</BeneficiaryShell>;
}
