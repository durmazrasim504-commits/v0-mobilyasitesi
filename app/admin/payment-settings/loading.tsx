import { Skeleton } from "@/components/ui/skeleton"

export default function PaymentSettingsLoading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-[250px]" />

      <div className="border rounded-lg p-6 space-y-6">
        <Skeleton className="h-6 w-[200px]" />

        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </div>

        <Skeleton className="h-10 w-[120px]" />
      </div>
    </div>
  )
}
