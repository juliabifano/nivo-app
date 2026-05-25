import Card from "../../ui/Card";

function SkeletonBox({ className = "" }) {
  return (
    <div
      className={`rounded-xl bg-white/[0.06] animate-pulse ${className}`}
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <Card className="col-span-6 p-6">
        <div className="flex h-full gap-5 items-center">
          <SkeletonBox className="w-[380px] h-[220px] rounded-2xl" />

          <div className="flex-1 space-y-4">
            <SkeletonBox className="w-28 h-4" />
            <SkeletonBox className="w-48 h-7" />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBox className="h-16 rounded-2xl" />
              <SkeletonBox className="h-16 rounded-2xl" />
            </div>
            <SkeletonBox className="h-16 rounded-2xl" />
          </div>
        </div>
      </Card>

      <div className="col-span-6 grid grid-cols-2 gap-4">
        <Card className="p-5">
          <SkeletonBox className="w-24 h-4 mb-4" />
          <div className="space-y-3">
            <SkeletonBox className="h-12 rounded-2xl" />
            <SkeletonBox className="h-12 rounded-2xl" />
            <SkeletonBox className="h-12 rounded-2xl" />
          </div>
        </Card>

        <Card className="p-5">
          <SkeletonBox className="w-28 h-4" />
          <SkeletonBox className="w-40 h-8 mt-3" />
          <SkeletonBox className="h-[120px] rounded-2xl mt-4" />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <SkeletonBox className="h-14 rounded-2xl" />
            <SkeletonBox className="h-14 rounded-2xl" />
          </div>
        </Card>
      </div>

      <Card className="col-span-8 p-5">
        <div className="flex justify-between mb-5">
          <div>
            <SkeletonBox className="w-40 h-4" />
            <SkeletonBox className="w-28 h-3 mt-2" />
          </div>

          <div className="grid grid-cols-3 gap-3 w-[520px]">
            <SkeletonBox className="h-14 rounded-2xl" />
            <SkeletonBox className="h-14 rounded-2xl" />
            <SkeletonBox className="h-14 rounded-2xl" />
          </div>
        </div>

        <SkeletonBox className="h-[220px] rounded-2xl" />
      </Card>

      <Card className="col-span-4 p-4">
        <SkeletonBox className="w-24 h-4" />
        <SkeletonBox className="w-36 h-3 mt-2 mb-4" />

        <div className="space-y-3">
          <SkeletonBox className="h-20 rounded-2xl" />
          <SkeletonBox className="h-20 rounded-2xl" />
          <SkeletonBox className="h-20 rounded-2xl" />
        </div>
      </Card>

      <Card className="col-span-8 p-4">
        <SkeletonBox className="w-36 h-4" />
        <SkeletonBox className="w-28 h-3 mt-2 mb-4" />

        <div className="grid grid-cols-4 gap-3">
          <SkeletonBox className="h-[74px] rounded-2xl" />
          <SkeletonBox className="h-[74px] rounded-2xl" />
          <SkeletonBox className="h-[74px] rounded-2xl" />
          <SkeletonBox className="h-[74px] rounded-2xl" />
        </div>
      </Card>

      <Card className="col-span-4 p-4">
        <SkeletonBox className="w-24 h-4" />
        <SkeletonBox className="w-28 h-3 mt-2 mb-4" />

        <div className="grid grid-cols-3 gap-2">
          <SkeletonBox className="h-[74px] rounded-2xl" />
          <SkeletonBox className="h-[74px] rounded-2xl" />
          <SkeletonBox className="h-[74px] rounded-2xl" />
        </div>
      </Card>
    </>
  );
}