import Image from 'next/image';

export default function CompanyLogo({ logoUrl, companyName }) {
  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <Image src={logoUrl} alt={companyName} width={160} height={32} className="h-8 w-auto object-contain" />
      ) : (
        <div className="h-8 w-8 rounded-md bg-primary" />
      )}
      <span className="text-xl font-bold tracking-tight">{companyName}</span>
    </div>
  );
}