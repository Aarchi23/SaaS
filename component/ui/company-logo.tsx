// components/ui/company-logo.tsx
export const CompanyLogo = ({ logoUrl, companyName }: { logoUrl?: string, companyName: string }) => {
  return (
    <div className="flex items-center gap-2">
      {logoUrl ? (
        <img src={logoUrl} alt={companyName} className="h-8 w-auto object-contain" />
      ) : (
        <div className="h-8 w-8 bg-primary rounded-md" /> // Fallback
      )}
      <span className="font-bold text-xl tracking-tight">{companyName}</span>
    </div>
  );
};